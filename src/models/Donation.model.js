import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    donorName: {
      type: String,
      default: "Anonymous Supporter",
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    cause: {
      type: String,
      default: "General Outreach & Welfare",
      trim: true,
    },
    paymentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["success", "pending", "failed"],
      default: "success",
    },
    date: {
      type: String,
    },
  },
  { timestamps: true }
);

const Donation = mongoose.model("Donation", donationSchema);

export default Donation;
