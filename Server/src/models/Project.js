import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    techStack: {
        type: [String],
        required: true,
    },
    liveUrl: {
        type: String,
    },
    githubUrl: {
        type: String,
    },
    image: {
        type: String,
    },
    features: {
        type: [String],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Project', projectSchema);
