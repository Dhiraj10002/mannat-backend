import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import galleryRoutes from "./routes/gallery.routes.js";
import joinUsRoutes from "./routes/joinUs.routes.js";
import contactRoutes from "./routes/contact.routes.js";

const app = express();

/* 🔥 ADD THIS */
const allowedOrigins = [
  "http://localhost:5173",            // local dev
  "https://your-frontend.vercel.app", // production frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);


app.use(express.json());

app.get("/", (req, res) => {
  res.send("Mannat Foundation Backend API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/join-us", joinUsRoutes);
app.use("/api/contact", contactRoutes);

export default app;
