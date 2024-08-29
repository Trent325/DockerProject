// applicantsRoutes.test.ts
import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express'; // Import the types from express
import router from '../src/routes/applicant'; // Adjust the path to point to your applicants.ts file
import { verifyToken } from '../src/middleware/authMiddleware'; // Adjust the path accordingly
import Applicant from '../src/models/Applicant';
import Job from '../src/models/Jobs';

// Mock the verifyToken middleware to always pass
jest.mock('../src/middleware/authMiddleware', () => ({
  verifyToken: (req: Request, res: Response, next: NextFunction) => next(), // Explicitly type req, res, next
}));

// Mock the Applicant and Job models
jest.mock('../src/models/Applicant');
jest.mock('../src/models/Jobs');

const app = express();
app.use(express.json());
app.use('/api/applicant', router); // Add the router to the express app

describe('Applicant Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PUT /api/applicant/profile', () => {
    it('should update applicant profile successfully', async () => {
      const mockApplicant = { _id: '123', name: 'John Doe', school: 'ABC University' };
      (Applicant.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockApplicant);

      const response = await request(app)
        .put('/api/applicant/profile')
        .send({ id: '123', name: 'John Doe', school: 'ABC University', degrees: 'BSc' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Profile updated successfully');
      expect(Applicant.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        { name: 'John Doe', school: 'ABC University', degrees: ['BSc'] },
        { new: true }
      );
    });

    it('should return 401 if user is not authenticated', async () => {
      const response = await request(app).put('/api/applicant/profile').send({});

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('User not authenticated');
    });
  });

  describe('GET /api/applicant/jobs', () => {
    it('should return all jobs', async () => {
      const mockJobs = [{ _id: '1', title: 'Software Developer' }];
      (Job.find as jest.Mock).mockResolvedValue(mockJobs);

      const response = await request(app).get('/api/applicant/jobs');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockJobs);
    });
  });

  describe('POST /api/applicant/apply', () => {
    it('should apply for a job successfully', async () => {
      const mockJob = { _id: '1', title: 'Software Developer' };
      const mockApplicant = { _id: '123', appliedJobs: [] };
      (Job.findById as jest.Mock).mockResolvedValue(mockJob);
      (Applicant.findById as jest.Mock).mockResolvedValue(mockApplicant);

      const response = await request(app)
        .post('/api/applicant/apply')
        .send({ applicantId: '123', jobId: '1' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Applied to job successfully');
      expect(Job.findByIdAndUpdate).toHaveBeenCalled();
      expect(Applicant.findByIdAndUpdate).toHaveBeenCalled();
    });

    it('should return 404 if job not found', async () => {
      (Job.findById as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post('/api/applicant/apply')
        .send({ applicantId: '123', jobId: '1' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Job not found.');
    });
  });

  // Add more tests for other routes...
});


