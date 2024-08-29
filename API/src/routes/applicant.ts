import express from 'express';
import multer from 'multer';
import Applicant from '../models/Applicant';
import { verifyToken } from '../middleware/authMiddleware';
import Job from '../models/Jobs';

const router = express.Router();

// Configure multer to store file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.put('/profile', verifyToken, upload.single('resume'), async (req, res) => {
  const { id, name, school, degrees } = req.body;
  if (!id) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const updateData: any = {
      name,
      school,
      degrees: degrees ? degrees.split(',') : []
    };

    // If a resume is uploaded, add it to the update data
    if (req.file) {
      updateData.resume = {
        data: req.file.buffer, // Save the file buffer
        contentType: req.file.mimetype // Save the file MIME type
      };
    }

    const updatedApplicant = await Applicant.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.status(200).json({ message: 'Profile updated successfully', applicant: updatedApplicant });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Route to get all jobs
router.get('/jobs', verifyToken, async (req, res) => {
  try {
    const jobs = await Job.find(); // Fetch all jobs from the Job collection
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Route to apply for a job
router.post('/apply', verifyToken, async (req, res) => {
  const { applicantId, jobId } = req.body;

  if (!applicantId || !jobId) {
    return res.status(400).json({ message: 'Applicant ID and Job ID are required.' });
  }

  try {
    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    // Check if the applicant exists
    const applicant = await Applicant.findById(applicantId);
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found.' });
    }

    // Add jobId to the applicant's appliedJobs field
    await Applicant.findByIdAndUpdate(
      applicantId,
      { $addToSet: { appliedJobs: jobId } }, // Use $addToSet to avoid duplicates
      { new: true }
    );

    // Add applicantId to the job's applicants field and applicantStatuses array
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        $addToSet: {
          applicants: applicantId,
          applicantStatuses: {
            applicantId,
            status: 'pending',
          },
        },
      },
      { new: true }
    );

    res.status(200).json({ message: 'Applied to job successfully', job: updatedJob });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


// Route to get all jobs applied by a specific applicant
router.get('/applied-jobs/:applicantId', verifyToken, async (req, res) => {
  const { applicantId } = req.params;

  try {
    // Find applicant and populate the appliedJobs field
    const applicant = await Applicant.findById(applicantId).populate('appliedJobs');

    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found.' });
    }

    res.status(200).json({ appliedJobs: applicant.appliedJobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Route to get all information for an applicant by their ID
router.get('/applicant/:applicantId', verifyToken, async (req, res) => {
  const { applicantId } = req.params;

  try {
    // Find the applicant by their ID and populate any relevant fields
    const applicant = await Applicant.findById(applicantId);

    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found.' });
    }

    res.status(200).json(applicant);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
