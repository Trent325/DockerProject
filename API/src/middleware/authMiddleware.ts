import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret') as { id: string; role: string };

    (req as any).user = { id: decoded.id, role: decoded.role }; // Type assertion workaround

    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};