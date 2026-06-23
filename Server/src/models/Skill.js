import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    icon: {
      type: String, // secure_url
      default: "",
    },

    iconPublicId: {
      type: String, // public_id
      default: "",
    },

    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Skill', skillSchema);
