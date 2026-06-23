import mongoose from "mongoose";

const aboutMeSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
      required: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    profileImagePublicId: {
      type: String,
      default: "",
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

export default mongoose.model("AboutMe", aboutMeSchema);