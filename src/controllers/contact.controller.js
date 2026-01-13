import Contact from "../models/Contact.model.js";

// Public: submit contact form
export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const data = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      message: "Message sent successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: view all messages
export const getAllContacts = async (req, res) => {
  try {
    const list = await Contact.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
