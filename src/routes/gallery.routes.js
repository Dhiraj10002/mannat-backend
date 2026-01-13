import express from "express";
import upload from "../middlewares/multer.js";
import protectAdmin from "../middlewares/auth.middleware.js";
import {
  uploadMedia,
  getGallery,
  deleteMedia,
} from "../controllers/gallery.controller.js";

const router = express.Router();

/* ✅ PUBLIC */
router.get("/", getGallery);

/* 🔐 ADMIN ONLY */
router.post("/upload", protectAdmin, upload.single("file"), uploadMedia);
router.delete("/:id", protectAdmin, deleteMedia);

export default router;
