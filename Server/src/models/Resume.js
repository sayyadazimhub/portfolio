import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Resume",
    },

    resumeUrl: {
      type: String,
      required: true,
    },

    resumePublicId: {
      type: String,
      required: true,
    },

    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Resume", resumeSchema);