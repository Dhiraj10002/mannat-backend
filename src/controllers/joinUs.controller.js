import JoinUs from "../models/JoinUs.model.js";

// Public: submit form
export const submitJoinUs = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "All required fields missing" });
    }

    const data = await JoinUs.create({
      name,
      email,
      phone,
      message,
    });

    res.status(201).json({
      message: "Form submitted successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: view all submissions
export const getAllJoinUs = async (req, res) => {
  try {
    const list = await JoinUs.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
