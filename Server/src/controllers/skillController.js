import Skill from '../models/Skill.js';
import cloudinary from '../config/cloudinary.js';

const groupSkillsByCategory = (skills) => {
    const grouped = skills.reduce((acc, skill) => {
        const categoryKey = skill.category?.trim() || 'General';

        if (!acc[categoryKey]) {
            acc[categoryKey] = {
                title: categoryKey,
                icon: skill.icon || 'FaCode',
                skills: [],
            };
        }

        acc[categoryKey].skills.push({
            name: skill.name,
            icon: skill.icon,
            iconPublicId: skill.iconPublicId,
            _id: skill._id
        });
        return acc;
    }, {});

    return Object.values(grouped);
};

export const getSkills = async (req, res) => {
    try {
        const { admin } = req.query;
        const skills = await Skill.find().sort({ category: 1, name: 1 });

        if (admin === 'true' || admin === '1') {
            return res.status(200).json(skills);
        }

        const categories = groupSkillsByCategory(skills.filter((skill) => skill.status));
        res.status(200).json(categories);
    } catch (err) {
        console.error('getSkills error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getSkillById = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);
        if (!skill) {
            return res.status(404).json({ success: false, message: 'Skill not found' });
        }
        res.status(200).json({ success: true, message: 'Skill retrieved successfully', data: skill });
    } catch (err) {
        console.error('getSkillById error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const createSkill = async (req, res) => {
    try {
        const { name, category, status } = req.body;

        if (!name?.trim() || !category?.trim()) {
            return res.status(400).json({ success: false, message: 'Name and category are required' });
        }

        let icon = req.body.icon || '';
        let iconPublicId = req.body.iconPublicId || '';

        if (req.file) {
            icon = req.file.path;
            iconPublicId = req.file.filename;
        }

        const skill = await Skill.create({
            name: name.trim(),
            category: category.trim(),
            icon,
            iconPublicId,
            status: status === 'false' || status === false ? false : true,
        });

        res.status(201).json({ success: true, message: 'Skill created successfully', data: skill });
    } catch (err) {
        console.error('createSkill error:', err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map((error) => error.message);
            return res.status(400).json({ success: false, message: 'Validation Error', errors: messages });
        }
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const updateSkill = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);
        if (!skill) {
            return res.status(404).json({ success: false, message: 'Skill not found' });
        }

        const { name, category, status } = req.body;

        let icon = skill.icon;
        let iconPublicId = skill.iconPublicId;

        if (req.file) {
            if (skill.iconPublicId) {
                await cloudinary.uploader.destroy(skill.iconPublicId);
            }
            icon = req.file.path;
            iconPublicId = req.file.filename;
        } else if (req.body.icon !== undefined) {
            icon = req.body.icon;
            iconPublicId = req.body.iconPublicId || skill.iconPublicId;
        }

        const updatedSkill = await Skill.findByIdAndUpdate(
            req.params.id,
            {
                name: name !== undefined ? name.trim() : skill.name,
                category: category !== undefined ? category.trim() : skill.category,
                icon,
                iconPublicId,
                status: status !== undefined ? (status === 'false' || status === false ? false : true) : skill.status,
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, message: 'Skill updated successfully', data: updatedSkill });
    } catch (err) {
        console.error('updateSkill error:', err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map((error) => error.message);
            return res.status(400).json({ success: false, message: 'Validation Error', errors: messages });
        }
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const deleteSkill = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);
        if (!skill) {
            return res.status(404).json({ success: false, message: 'Skill not found' });
        }

        if (skill.iconPublicId) {
            await cloudinary.uploader.destroy(skill.iconPublicId);
        }

        await Skill.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Skill deleted successfully' });
    } catch (err) {
        console.error('deleteSkill error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
