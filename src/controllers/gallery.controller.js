import cloudinary from "../config/cloudinary.js";
import Gallery from "../models/Gallery.model.js";
import streamifier from "streamifier";

export const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const isVideo = req.file.mimetype.startsWith("video");
    const resourceType = isVideo ? "video" : "image";

    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary error:", error);
          return res.status(500).json({ message: error.message });
        }

        const media = await Gallery.create({
          url: result.secure_url,
          public_id: result.public_id,
          type: resourceType,
        });

        res.status(201).json(media);
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({ message: "Upload failed" });
  }
};

/* PUBLIC */
export const getGallery = async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to load gallery" });
  }
};


// export const getGallery = async (req, res) => {
//   const gallery = await Gallery.find().sort({ createdAt: -1 });
//   res.json(gallery);
// };

export const deleteMedia = async (req, res) => {
  try {
    const media = await Gallery.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    await cloudinary.uploader.destroy(media.public_id, {
      resource_type: media.type,    
    });

    await media.deleteOne();

    res.json({ message: "Media deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



