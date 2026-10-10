import Donation from "../models/Donation.model.js";

const SEED_DONATIONS = [
  {
    donorName: "Priya Sharma",
    amount: 1000,
    cause: "Child Education Drive",
    paymentId: "pay_seed_priya_01",
    status: "success",
    date: "10 Oct 2026, 12:30 PM",
  },
  {
    donorName: "Rahul Verma",
    amount: 2500,
    cause: "Community Nutrition & Meals",
    paymentId: "pay_seed_rahul_02",
    status: "success",
    date: "09 Oct 2026, 04:15 PM",
  },
  {
    donorName: "Ananya Deshmukh",
    amount: 5000,
    cause: "Medical Support & Health Camps",
    paymentId: "pay_seed_ananya_03",
    status: "success",
    date: "08 Oct 2026, 06:40 PM",
  },
  {
    donorName: "Anonymous Supporter",
    amount: 500,
    cause: "Animal Welfare & Rescue",
    paymentId: "pay_seed_anon_04",
    status: "success",
    date: "08 Oct 2026, 10:10 AM",
  },
];

// Public: Record a successful Razorpay donation
export const createDonation = async (req, res) => {
  try {
    const { paymentId, amount, donorName, cause, email, date } = req.body;

    if (!paymentId || !amount) {
      return res.status(400).json({ message: "paymentId and amount are required" });
    }

    const existing = await Donation.findOne({ paymentId });
    if (existing) {
      return res.status(200).json({ message: "Donation already recorded", data: existing });
    }

    const donation = await Donation.create({
      paymentId,
      amount: Number(amount),
      donorName: donorName?.trim() || "Anonymous Supporter",
      cause: cause?.trim() || "General Outreach & Welfare",
      email: email?.trim() || "",
      date: date || new Date().toISOString(),
      status: "success",
    });

    res.status(201).json({
      message: "Donation recorded successfully",
      data: donation,
    });
  } catch (error) {
    console.error("Donation creation error:", error);
    res.status(500).json({ message: error.message || "Failed to record donation" });
  }
};

// Public/Admin: Get all donations (for live ticker & admin portal)
export const getDonations = async (req, res) => {
  try {
    let list = await Donation.find().sort({ createdAt: -1 });

    // Seed default records if brand new database
    if (list.length === 0) {
      try {
        await Donation.insertMany(SEED_DONATIONS);
        list = await Donation.find().sort({ createdAt: -1 });
      } catch (seedErr) {
        // Fallback in-memory list if insert fails
        return res.json(SEED_DONATIONS);
      }
    }

    res.json(list);
  } catch (error) {
    console.error("Fetch donations error:", error);
    res.status(500).json({ message: "Failed to fetch donations" });
  }
};
