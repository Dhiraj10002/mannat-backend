import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Email check
    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 2️⃣ Password check (PLAIN ENV PASSWORD)
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3️⃣ Generate token
    const token = jwt.sign(
      { role: "admin", email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
