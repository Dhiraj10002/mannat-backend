import express from "express";
import {
  submitJoinUs,
  getAllJoinUs,
} from "../controllers/joinUs.controller.js";
import protectAdmin from "../middlewares/auth.middleware.js";

const router = express.Router();

// public
router.post("/", submitJoinUs);

// admin
router.get("/", protectAdmin, getAllJoinUs);

export default router;
