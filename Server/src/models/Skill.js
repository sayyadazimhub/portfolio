import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: true,
    },
    skills: {
        type: [String],
        required: true,
    },
});

export default mongoose.model('Skill', SkillSchema);
