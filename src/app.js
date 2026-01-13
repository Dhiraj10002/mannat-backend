import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import galleryRoutes from "./routes/gallery.routes.js";
import joinUsRoutes from "./routes/joinUs.routes.js";
import contactRoutes from "./routes/contact.routes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://mannat-frontend.vercel.app",
  "https://mannat-frontend-git-main-dhiraj10002s-projects.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Postman / server calls
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Express 5 SAFE preflight handling
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/join-us", joinUsRoutes);
app.use("/api/contact", contactRoutes);

export default app;
