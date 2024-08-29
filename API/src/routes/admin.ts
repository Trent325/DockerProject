import { Router, Request, Response, NextFunction } from "express";
import HiringManager from "../models/HiringManger";
import jwt from "jsonwebtoken";

const router = Router();

// Middleware to verify admin token
const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, "your_jwt_secret") as { role: string };

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Not an admin." });
    }

    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

// Route to get a list of all hiring managers
router.get(
  "/hiring-managers",
  verifyAdmin,
  async (req: Request, res: Response) => {
    try {
      const hiringManagers = await HiringManager.find();
      res.json(hiringManagers);
    } catch (error) {
      console.error("Error fetching hiring managers:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Route to approve a hiring manager
router.patch(
  "/hiring-managers/:id/approve",
  verifyAdmin,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const hiringManager = await HiringManager.findById(id);
      if (!hiringManager) {
        return res.status(404).json({ message: "Hiring manager not found" });
      }

      hiringManager.isApproved = true;
      await hiringManager.save();

      res.json({ message: "Hiring manager approved successfully" });
    } catch (error) {
      console.error("Error approving hiring manager:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Route to deny a hiring manager (using deleteOne instead of remove)
router.delete(
  "/hiring-managers/:id/deny",
  verifyAdmin,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const result = await HiringManager.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Hiring manager not found" });
      }

      res.json({ message: "Hiring manager denied and removed successfully" });
    } catch (error) {
      console.error("Error denying hiring manager:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
