import express from "express";
import {
  submitContact,
  getAllContacts,
} from "../controllers/contact.controller.js";
import protectAdmin from "../middlewares/auth.middleware.js";

const router = express.Router();

// public
router.post("/", submitContact);

// admin
router.get("/", protectAdmin, getAllContacts);

export default router;
