import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.model.js";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1️⃣ Check MongoDB Admins collection
    const adminUser = await User.findOne({ email: normalizedEmail });
    if (adminUser) {
      let isMatch = false;
      // Support plain-text or bcrypt hash
      if (adminUser.password === password) {
        isMatch = true;
      } else {
        try {
          isMatch = await bcrypt.compare(password, adminUser.password);
        } catch (e) {
          isMatch = false;
        }
      }

      if (isMatch) {
        const token = jwt.sign(
          { role: adminUser.role || "admin", email: adminUser.email, id: adminUser._id },
          process.env.JWT_SECRET || "mannat_secret_fallback_key",
          { expiresIn: "1d" }
        );
        return res.json({ token });
      }
    }

    // 2️⃣ Fallback: Check ENV credentials (if defined)
    if (
      process.env.ADMIN_EMAIL &&
      process.env.ADMIN_PASSWORD &&
      normalizedEmail === process.env.ADMIN_EMAIL.trim().toLowerCase() &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { role: "admin", email: normalizedEmail },
        process.env.JWT_SECRET || "mannat_secret_fallback_key",
        { expiresIn: "1d" }
      );
      return res.json({ token });
    }

    return res.status(401).json({ message: "Invalid credentials" });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
