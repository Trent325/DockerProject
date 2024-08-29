// src/userRoutes.ts
import express from 'express';
import requestIp from 'request-ip';

const router = express.Router();

// Define a route to get the user's IP address
router.get('/get-ip', (req, res) => {
  const clientIp = req.clientIp; // Retrieve the user's IP address from the request
  res.json({ ip: clientIp });
});

export default router;
