import Experience from '../models/Experience.js';

const parseBoolean = (value) => value === true || value === 'true' || value === '1' || value === 1;

export const getExperience = async (req, res) => {
    try {
        const { admin } = req.query;
        const query = admin === 'true' || admin === '1' ? {} : { status: true };
        const experience = await Experience.find(query).sort({ order: -1, startDate: -1 });
        res.status(200).json(experience);
    } catch (err) {
        console.error('getExperience error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getExperienceById = async (req, res) => {
    try {
        const experience = await Experience.findById(req.params.id);
        if (!experience) {
            return res.status(404).json({ message: 'Experience not found' });
        }
        res.status(200).json(experience);
    } catch (err) {
        console.error('getExperienceById error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const createExperience = async (req, res) => {
    try {
        const {
            jobTitle,
            company,
            employmentType,
            location,
            startDate,
            endDate,
            currentlyWorking,
            description,
            status,
            order,
        } = req.body;

        if (!jobTitle?.trim() || !company?.trim() || !startDate) {
            return res.status(400).json({ message: 'Job title, company, and start date are required' });
        }

        const experience = await Experience.create({
            jobTitle: jobTitle.trim(),
            company: company.trim(),
            employmentType: employmentType || 'Full Time',
            location: location || '',
            startDate: new Date(startDate),
            endDate: currentlyWorking === 'true' || currentlyWorking === true ? null : endDate ? new Date(endDate) : null,
            currentlyWorking: parseBoolean(currentlyWorking),
            description: description || '',
            status: parseBoolean(status),
            order: order !== undefined ? Number(order) : 0,
        });

        res.status(201).json(experience);
    } catch (err) {
        console.error('createExperience error:', err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map((error) => error.message);
            return res.status(400).json({ message: 'Validation Error', errors: messages });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

export const updateExperience = async (req, res) => {
    try {
        const experience = await Experience.findById(req.params.id);
        if (!experience) {
            return res.status(404).json({ message: 'Experience not found' });
        }

        const {
            jobTitle,
            company,
            employmentType,
            location,
            startDate,
            endDate,
            currentlyWorking,
            description,
            status,
            order,
        } = req.body;

        experience.jobTitle = jobTitle !== undefined ? jobTitle.trim() : experience.jobTitle;
        experience.company = company !== undefined ? company.trim() : experience.company;
        experience.employmentType = employmentType !== undefined ? employmentType : experience.employmentType;
        experience.location = location !== undefined ? location : experience.location;
        experience.startDate = startDate !== undefined ? new Date(startDate) : experience.startDate;
        experience.currentlyWorking = currentlyWorking !== undefined ? parseBoolean(currentlyWorking) : experience.currentlyWorking;
        experience.endDate = experience.currentlyWorking
            ? null
            : endDate !== undefined
            ? endDate
                ? new Date(endDate)
                : null
            : experience.endDate;
        experience.description = description !== undefined ? description : experience.description;
        experience.status = status !== undefined ? parseBoolean(status) : experience.status;
        experience.order = order !== undefined ? Number(order) : experience.order;

        const updatedExperience = await experience.save();
        res.status(200).json(updatedExperience);
    } catch (err) {
        console.error('updateExperience error:', err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map((error) => error.message);
            return res.status(400).json({ message: 'Validation Error', errors: messages });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

export const deleteExperience = async (req, res) => {
    try {
        const experience = await Experience.findById(req.params.id);
        if (!experience) {
            return res.status(404).json({ message: 'Experience not found' });
        }

        await Experience.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Experience deleted successfully' });
    } catch (err) {
        console.error('deleteExperience error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};
