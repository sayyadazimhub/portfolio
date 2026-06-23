import Education from '../models/Education.js';

const parseBoolean = (value) => value === true || value === 'true' || value === '1' || value === 1;

export const getEducation = async (req, res) => {
    try {
        const { admin } = req.query;
        const query = admin === 'true' || admin === '1' ? {} : { status: true };
        const education = await Education.find(query).sort({ order: -1, startDate: -1 });
        res.status(200).json(education);
    } catch (error) {
        console.error('getEducation error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getEducationById = async (req, res) => {
    try {
        const education = await Education.findById(req.params.id);
        if (!education) {
            return res.status(404).json({ message: 'Education item not found' });
        }
        res.status(200).json(education);
    } catch (error) {
        console.error('getEducationById error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const createEducation = async (req, res) => {
    try {
        const { degree, institution, fieldOfStudy, startDate, endDate, grade, description, status, order } = req.body;

        if (!degree?.trim() || !institution?.trim() || !startDate || !endDate) {
            return res.status(400).json({ message: 'Degree, institution, start date, and end date are required' });
        }

        const education = await Education.create({
            degree: degree.trim(),
            institution: institution.trim(),
            fieldOfStudy: fieldOfStudy || '',
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            grade: grade || '',
            description: description || '',
            status: parseBoolean(status),
            order: order !== undefined ? Number(order) : 0,
        });

        res.status(201).json(education);
    } catch (error) {
        console.error('createEducation error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({ message: 'Validation Error', errors: messages });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

export const updateEducation = async (req, res) => {
    try {
        const education = await Education.findById(req.params.id);
        if (!education) {
            return res.status(404).json({ message: 'Education item not found' });
        }

        const { degree, institution, fieldOfStudy, startDate, endDate, grade, description, status, order } = req.body;

        education.degree = degree !== undefined ? degree.trim() : education.degree;
        education.institution = institution !== undefined ? institution.trim() : education.institution;
        education.fieldOfStudy = fieldOfStudy !== undefined ? fieldOfStudy : education.fieldOfStudy;
        education.startDate = startDate !== undefined ? new Date(startDate) : education.startDate;
        education.endDate = endDate !== undefined ? new Date(endDate) : education.endDate;
        education.grade = grade !== undefined ? grade : education.grade;
        education.description = description !== undefined ? description : education.description;
        education.status = status !== undefined ? parseBoolean(status) : education.status;
        education.order = order !== undefined ? Number(order) : education.order;

        const updatedEducation = await education.save();
        res.status(200).json(updatedEducation);
    } catch (error) {
        console.error('updateEducation error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({ message: 'Validation Error', errors: messages });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

export const deleteEducation = async (req, res) => {
    try {
        const education = await Education.findById(req.params.id);
        if (!education) {
            return res.status(404).json({ message: 'Education item not found' });
        }

        await Education.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Education item deleted successfully' });
    } catch (error) {
        console.error('deleteEducation error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
