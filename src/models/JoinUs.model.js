import mongoose from "mongoose";

const joinUsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const JoinUs = mongoose.model("JoinUs", joinUsSchema);

export default JoinUs;
