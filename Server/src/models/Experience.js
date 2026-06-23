import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    employmentType: {
      type: String,
      enum: [
        "Full Time",
        "Part Time",
        "Internship",
        "Freelance",
        "Contract",
      ],
      default: "Internship",
    },

    location: {
      type: String,
      default: "",
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      default: null,
    },

    currentlyWorking: {
      type: Boolean,
      default: false,
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

export default mongoose.model('Experience', experienceSchema);