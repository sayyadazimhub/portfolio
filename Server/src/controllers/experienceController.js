import Experience from '../models/Experience.js';

export const getExperience = async (req, res) => {
    try {
        // Sort by startDate descending (newest first)
        const experience = await Experience.find().sort({ startDate: -1 });
        res.json(experience);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
