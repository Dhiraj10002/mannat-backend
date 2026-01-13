import express from "express";
import { adminLogin } from "../controllers/auth.controller.js";
import protectAdmin from "../middlewares/auth.middleware.js";

const router = express.Router();

// Admin login
router.post("/login", adminLogin);

// Test protected route
router.get("/me", protectAdmin, (req, res) => {
  res.json({
    message: "Admin access granted",
    admin: req.admin,
  });
});

export default router;
