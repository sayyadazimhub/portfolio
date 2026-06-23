import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    issuer: {
      type: String,
      required: true,
      trim: true,
    },

    issueDate: {
      type: Date,
      required: true,
    },

    credentialId: {
      type: String,
      default: "",
    },

    credentialUrl: {
      type: String,
      default: "",
    },

    certificateImage: {
      type: String,
      default: "",
    },

    certificatePublicId: {
      type: String,
      default: "",
    },

    status: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Certificate", certificateSchema);