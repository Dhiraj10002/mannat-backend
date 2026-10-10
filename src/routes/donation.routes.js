import express from "express";
import {
  createDonation,
  getDonations,
} from "../controllers/donation.controller.js";

const router = express.Router();

// GET all donations (public for live supporter ticker & admin portal)
router.get("/", getDonations);

// POST record new donation (from Razorpay checkout)
router.post("/", createDonation);

export default router;
