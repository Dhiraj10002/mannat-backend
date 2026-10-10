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

    // ⚡ Automatic Cloudinary Compression & Optimization Options
    const uploadOptions = isVideo
      ? {
          resource_type: "video",
          folder: "mannat_gallery",
          transformation: [
            { quality: "auto", fetch_format: "auto" },
            { width: 1280, crop: "limit" }
          ],
        }
      : {
          resource_type: "image",
          folder: "mannat_gallery",
          transformation: [
            { quality: "auto:good", fetch_format: "auto" },
            { width: 1600, height: 1600, crop: "limit" }
          ],
        };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      async (error, result) => {
        if (error) {
          console.error("Cloudinary error:", error);
          return res.status(500).json({ message: error.message });
        }

        // Embed automatic format (WebP/AVIF) and perceptual compression directly in delivery URL
        let deliveryUrl = result.secure_url;
        if (isVideo) {
          deliveryUrl = deliveryUrl.replace(
            "/upload/",
            "/upload/f_auto,q_auto,vc_auto,w_1280,c_limit/"
          );
        } else {
          deliveryUrl = deliveryUrl.replace(
            "/upload/",
            "/upload/f_auto,q_auto:good,w_1600,c_limit/"
          );
        }

        const media = await Gallery.create({
          url: deliveryUrl,
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

/* PUBLIC: Serves gallery items with automatic format & compression optimization */
export const getGallery = async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 }).lean();
    const optimizedItems = items.map((item) => {
      if (item.url && item.url.includes("res.cloudinary.com") && !item.url.includes("f_auto")) {
        const transform = item.type === "video"
          ? "f_auto,q_auto,vc_auto,w_1280,c_limit"
          : "f_auto,q_auto:good,w_1600,c_limit";
        return {
          ...item,
          url: item.url.replace("/upload/", `/upload/${transform}/`),
        };
      }
      return item;
    });
    res.json(optimizedItems);
  } catch (err) {
    res.status(500).json({ message: "Failed to load gallery" });
  }
};

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
