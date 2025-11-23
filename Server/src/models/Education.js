import mongoose from 'mongoose';

const EducationSchema = new mongoose.Schema({
    institution: {
        type: String,
        required: true,
    },
    degree: {
        type: String,
        required: true,
    },
    period: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    location: {
        type: String,
    },
    grade: {
        type: String,
    },
    achievements: {
        type: [String],
    },
    description: {
        type: String,
    },
});

export default mongoose.model('Education', EducationSchema);
