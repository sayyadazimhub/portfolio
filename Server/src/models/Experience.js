import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true,
    },
    role: {
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
    technologies: {
        type: [String],
    },
    companyLogo: {
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
});

export default mongoose.model('Experience', ExperienceSchema);
