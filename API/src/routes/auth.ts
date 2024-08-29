import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import HiringManager from '../models/HiringManger';
import Applicant from '../models/Applicant';

const router = Router();

interface IRegisterRequest extends Request {
    body: {
      username: string;
      password: string;
      role: 'hiringManager' | 'applicant';
      companyName?: string; // Specific to HiringManager
      resume?: string; // Specific to Applicant
    };
  }

  interface ILoginRequest extends Request {
    body: {
      username: string;
      password: string;
      role: 'hiringManager' | 'applicant' | 'admin';
    };
  }
  
  // Login route
  router.post('/login', async (req: ILoginRequest, res: Response) => {
    const { username, password, role } = req.body;
  
    // Validate the role
    if (!['hiringManager', 'applicant', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }
  
    try {
      // Hardcoded admin credentials
      if (role === 'admin') {
        if (username === 'admin' && password === 'admin') {
          // Generate JWT with admin role
          const token = jwt.sign(
            { id: 'admin', role: 'admin' },
            'your_jwt_secret',
            { expiresIn: '1h' }
          );
  
          return res.json({ token, role: 'admin' });
        } else {
          return res.status(400).json({ message: 'Invalid admin credentials' });
        }
      }
  
      let user;
      if (role === 'hiringManager') {
        user = await HiringManager.findOne({ username });
        if (user && !user.isApproved) {
          return res.status(403).json({ message: 'Your account is not yet approved by an admin.' });
        }
      } else if (role === 'applicant') {
        user = await Applicant.findOne({ username });
      }
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT with user role
      const token = jwt.sign(
        { id: user._id, role: role },
        'your_jwt_secret',
        { expiresIn: '1h' }
      );
  
      res.json({ token, role });
    } catch (error) {
      console.error('Error during login process:', error);
      res.status(500).send('Server error');
    }
  });

router.post('/register', async (req: IRegisterRequest, res: Response) => {
    const { username, password, role, companyName, resume } = req.body;
  
    // Validate the role
    if (!['hiringManager', 'applicant'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }
  
    try {
      // Check if user already exists in the respective collection
      const existingUser =
        role === 'hiringManager'
          ? await HiringManager.findOne({ username })
          : await Applicant.findOne({ username });
  
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new user in the appropriate collection
      if (role === 'hiringManager') {
        const newHiringManager = new HiringManager({
          username,
          password: hashedPassword,
          companyName, // Additional field specific to HiringManager
        });
        await newHiringManager.save();
      } else {
        const newApplicant = new Applicant({
          username,
          password: hashedPassword,
          resume, // Additional field specific to Applicant
        });
        await newApplicant.save();
      }
  
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error during registration process:', error);
      res.status(500).send('Server error');
    }
  });

export default router;