import Project from '../models/Project.js';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.status(200).json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add a new project
// @route   POST /api/projects
// @access  Private (Admin only - simplified for now)
export const addProject = async (req, res) => {
    try {
        const { title, description, techStack, liveUrl, githubUrl, image, features } = req.body;

        if (!title || !description || !techStack) {
            return res.status(400).json({ message: 'Please fill in required fields' });
        }

        const project = await Project.create({
            title,
            description,
            techStack,
            liveUrl,
            githubUrl,
            image,
            features,
        });

        res.status(201).json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
