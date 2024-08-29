import express, { Request, Response } from 'express';
import connectDB from './services/db';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import managerRoutes from './routes/hiringManager';
import applicantRoutes from './routes/applicant'; 
import dotenv from 'dotenv';
import cors from 'cors'; // Ensure CORS is imported properly

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors());  // Use CORS middleware

// Connect to MongoDB
connectDB();

// Basic route for testing
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

// Use application routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.use('/api/applicant', applicantRoutes);  // Add applicant routes

app.use('/api/manager', managerRoutes);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

