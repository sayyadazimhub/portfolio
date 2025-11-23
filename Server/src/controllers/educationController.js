import Education from '../models/Education.js';

export const getEducation = async (req, res) => {
    try {
        const education = await Education.find().sort({ startDate: -1 });
        res.json(education);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
