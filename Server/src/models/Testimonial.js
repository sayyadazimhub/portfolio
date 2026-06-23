import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    cloudinaryId: {
        type: String,
    },
    linkedInUrl: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
}, { timestamps: true });

export default mongoose.model("Testimonial", testimonialSchema);