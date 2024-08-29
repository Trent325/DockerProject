import { Router, Request, Response } from 'express';
import Job from '../models/Jobs';
import HiringManager from '../models/HiringManger';
import jwt from "jsonwebtoken";
import { ObjectId } from 'mongodb';
import Applicant from '../models/Applicant';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

// Middleware to verify hiring manager role
const verifyHiringManager = (req: Request, res: Response, next: Function) => {
    const token = req.headers["authorization"]?.split(" ")[1];
  
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }
  
    try {
      const decoded = jwt.verify(token, "your_jwt_secret") as { role: string };
  
      if (decoded.role !== "hiringManager") {
        return res.status(403).json({ message: "Access denied. Not an admin." });
      }
  
      next();
    } catch (error) {
      res.status(400).json({ message: "Invalid token." });
    }
  };

// Route to create a new job
router.post('/jobs', verifyToken, verifyHiringManager, async (req: Request, res: Response) => {
  const { title, description, location,salary, userId, category, postDate } = req.body;
  const hiringManagerId = userId; // Get hiring manager ID from token

  try {
    // Create new job
    const newJob = new Job({ title, description, location, hiringManagerId, salary, category, postDate });
    await newJob.save();

    // Add job ID to the hiring manager's job list
    await HiringManager.findByIdAndUpdate(hiringManagerId, {
      $push: { jobIds: newJob._id },
    });

    res.status(201).json(newJob);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to get all jobs for a hiring manager
router.get('/jobs', verifyToken, verifyHiringManager, async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;

    if (!userId || !ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid or missing userId' });
    }

    const hiringManagerId = new ObjectId(userId);
    const jobs = await Job.find({ hiringManagerId });

    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/jobs/:jobId/applicants/:applicantId/accept', verifyToken, verifyHiringManager, async (req: Request, res: Response) => {
  const { jobId, applicantId } = req.params;

  try {
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const applicantStatus = job.applicantStatuses.find(status => status.applicantId.toString() === applicantId);

    if (!applicantStatus) {
      return res.status(404).json({ message: 'Applicant not found for this job' });
    }

    applicantStatus.status = 'accepted';

    await job.save();

    res.status(200).json({ message: 'Applicant accepted', job });
  } catch (error) {
    console.error('Error accepting applicant:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/jobs/:jobId/applicants/:applicantId/decline', verifyToken, verifyHiringManager, async (req: Request, res: Response) => {
  const { jobId, applicantId } = req.params;

  try {
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const applicantStatus = job.applicantStatuses.find(status => status.applicantId.toString() === applicantId);

    if (!applicantStatus) {
      return res.status(404).json({ message: 'Applicant not found for this job' });
    }

    applicantStatus.status = 'declined';

    await job.save();

    res.status(200).json({ message: 'Applicant declined', job });
  } catch (error) {
    console.error('Error declining applicant:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to delete a job
router.delete('/jobs/:jobId', verifyToken, verifyHiringManager, async (req: Request, res: Response) => {
  const { jobId } = req.params;

  try {
    // Check if jobId is a valid ObjectId string
    if (!ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: 'Invalid jobId' });
    }

    // Find and delete the job
    const deletedJob = await Job.findByIdAndDelete(jobId);

    if (!deletedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Remove the job reference from the hiring manager's job list
    await HiringManager.updateOne(
      { jobIds: new ObjectId(jobId) },
      { $pull: { jobIds: new ObjectId(jobId) } }
    );

    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to update a job
router.put('/jobs/:jobId', verifyToken, verifyHiringManager, async (req: Request, res: Response) => {
  const { jobId } = req.params;
  const { title, description, location, salary, category, postDate } = req.body;

  try {
    if (!ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: 'Invalid jobId' });
    }

    // Find and update the job
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { title, description, location, salary, category, postDate },
      { new: true } // Return the updated job
    );

    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json(updatedJob);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to get a specific job by ID
router.get('/jobs/:jobId', verifyToken, async (req: Request, res: Response) => {
  const { jobId } = req.params;

  try {
    // Validate jobId
    if (!ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: 'Invalid jobId' });
    }

    // Find and return the job
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to get applicants by their IDs
router.get('/applicants', verifyToken, async (req: Request, res: Response) => {
  // Ensure that ids is an array of strings
  const ids = req.query.ids as string[];

  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({ message: 'Invalid or missing ids' });
  }

  try {
    // Convert ids to ObjectId
    const applicantIds = ids.map(id => new ObjectId(id));

    // Find applicants by their IDs
    const applicants = await Applicant.find({ _id: { $in: applicantIds } });

    if (!applicants.length) {
      return res.status(404).json({ message: 'No applicants found' });
    }

    res.json(applicants);
  } catch (error) {
    console.error('Error fetching applicants:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/resume/:applicantId', verifyToken, async (req, res) => {
  const { applicantId } = req.params;

  try {
    const applicant = await Applicant.findById(applicantId);
    if (!applicant || !applicant.resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const { data, contentType } = applicant.resume;

    // Set the appropriate content type for the response
    res.setHeader('Content-Type', contentType);
    res.send(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;