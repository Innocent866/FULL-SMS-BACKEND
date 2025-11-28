import { Router } from 'express';
import { parentSignup, login, refreshToken } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
import User from '../models/User.js';

const router = Router();

router.post('/parent/signup', parentSignup);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.get("/me", authenticate, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) return res.status(404).json({ error: "User not found" });
  
      res.status(200).json({ data: user });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });
router.get("/users", async (req, res) => {
    try {
      const user = await User.find();
      if (!user) return res.status(404).json({ error: "User not found" });
  
      res.status(200).json({ data: user });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });

export default router;
