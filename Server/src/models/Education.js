import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema(
  {
    degree: {
      type: String,
      required: true,
      trim: true,
    },

    institution: {
      type: String,
      required: true,
      trim: true,
    },

    fieldOfStudy: {
      type: String,
      default: "",
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    grade: {
      type: String,
      default: "",
    },

    description: {
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

export default mongoose.model('Education', educationSchema);
