import cloudinary from '../config/cloudinary.js';
import Project from '../models/Project.js';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ order: 1, createdAt: -1 });
        res.status(200).json({ success: true, message: 'Projects retrieved successfully', data: projects });
    } catch (error) {
        console.error('getProjects error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get a single project by ID
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        res.status(200).json({ success: true, message: 'Project retrieved successfully', data: project });
    } catch (error) {
        console.error('getProjectById error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Add a new project
// @route   POST /api/projects
// @access  Private (Admin only)
export const addProject = async (req, res) => {
    try {
        const { projectName, description, projectType, projectCategory, liveUrl, githubUrl, clientName, clientCity, featured, status, order } = req.body;

        // Parse technologies gracefully from array, JSON string, or comma-separated string
        let parsedTechnologies = [];
        if (req.body.technologies) {
            if (Array.isArray(req.body.technologies)) {
                parsedTechnologies = req.body.technologies;
            } else {
                try {
                    parsedTechnologies = JSON.parse(req.body.technologies);
                    if (!Array.isArray(parsedTechnologies)) {
                        parsedTechnologies = [parsedTechnologies];
                    }
                } catch (e) {
                    parsedTechnologies = req.body.technologies
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean);
                }
            }
        }

        // Build file objects if uploaded
        const desktopImage = req.files?.desktopImage?.[0]
            ? {
                  url: req.files.desktopImage[0].path,
                  public_id: req.files.desktopImage[0].filename || req.files.desktopImage[0].public_id,
              }
            : null;

        const mobileImage = req.files?.mobileImage?.[0]
            ? {
                  url: req.files.mobileImage[0].path,
                  public_id: req.files.mobileImage[0].filename || req.files.mobileImage[0].public_id,
              }
            : null;

        const clientLogo = req.files?.clientLogo?.[0]
            ? {
                  url: req.files.clientLogo[0].path,
                  public_id: req.files.clientLogo[0].filename || req.files.clientLogo[0].public_id,
              }
            : null;

        // Validate required fields
        const errors = [];
        if (!projectName?.trim()) errors.push('Project name is required');
        if (!description?.trim()) errors.push('Description is required');
        if (!projectCategory?.trim()) errors.push('Project category is required');
        if (!projectType?.trim()) errors.push('Project type is required');
        if (!desktopImage) errors.push('Desktop preview image is required');
        if (!mobileImage) errors.push('Mobile preview image is required');

        if (errors.length > 0) {
            // Clean up uploaded images on failure to avoid orphans on Cloudinary
            const cleanupFiles = [desktopImage, mobileImage, clientLogo].filter(Boolean);
            for (const file of cleanupFiles) {
                try {
                    await cloudinary.uploader.destroy(file.public_id);
                } catch (destroyError) {
                    console.error('Failed to destroy orphaned file on validation error:', destroyError);
                }
            }
            return res.status(400).json({ success: false, message: 'Validation Error', errors });
        }

        const project = await Project.create({
            projectName: projectName.trim(),
            description: description.trim(),
            projectCategory,
            projectType,
            technologies: parsedTechnologies,
            liveUrl: liveUrl || '',
            githubUrl: githubUrl || '',
            desktopImage,
            mobileImage,
            clientLogo: clientLogo || undefined,
            clientName: clientName || '',
            clientCity: clientCity || '',
            featured: featured === 'true' || featured === true,
            status: status || 'Completed',
            order: order !== undefined ? Number(order) : 0,
        });

        res.status(201).json({ success: true, message: 'Project created successfully', data: project });
    } catch (error) {
        console.error('addProject error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ success: false, message: 'Validation Error', errors: messages });
        }
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private (Admin only)
export const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        const { projectName, description, projectType, projectCategory, liveUrl, githubUrl, clientName, clientCity, featured, status, order } = req.body;

        // Parse technologies gracefully
        let parsedTechnologies = project.technologies;
        if (req.body.technologies) {
            if (Array.isArray(req.body.technologies)) {
                parsedTechnologies = req.body.technologies;
            } else {
                try {
                    parsedTechnologies = JSON.parse(req.body.technologies);
                    if (!Array.isArray(parsedTechnologies)) {
                        parsedTechnologies = [parsedTechnologies];
                    }
                } catch (e) {
                    parsedTechnologies = req.body.technologies
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean);
                }
            }
        }

        let category = projectCategory || project.projectCategory;
        let type = projectType || project.projectType;

        // Dynamic auto-migration of legacy database fields during document updates
        if (type === 'Personal' || type === 'Client') {
            category = type;
            type = 'Full Stack';
        }

        const updateData = {
            projectName: projectName !== undefined ? projectName.trim() : project.projectName,
            description: description !== undefined ? description.trim() : project.description,
            projectCategory: category,
            projectType: type,
            technologies: parsedTechnologies,
            liveUrl: liveUrl !== undefined ? liveUrl : project.liveUrl,
            githubUrl: githubUrl !== undefined ? githubUrl : project.githubUrl,
            clientName: clientName !== undefined ? clientName : project.clientName,
            clientCity: clientCity !== undefined ? clientCity : project.clientCity,
            featured: featured !== undefined ? (featured === 'true' || featured === true) : project.featured,
            status: status || project.status,
            order: order !== undefined ? Number(order) : project.order,
        };

        // Process file updates and destroy old ones
        if (req.files?.desktopImage?.[0]) {
            if (project.desktopImage?.public_id) {
                try {
                    await cloudinary.uploader.destroy(project.desktopImage.public_id);
                } catch (err) {
                    console.error('Failed to destroy old desktopImage:', err);
                }
            }
            updateData.desktopImage = {
                url: req.files.desktopImage[0].path,
                public_id: req.files.desktopImage[0].filename || req.files.desktopImage[0].public_id,
            };
        }

        if (req.files?.mobileImage?.[0]) {
            if (project.mobileImage?.public_id) {
                try {
                    await cloudinary.uploader.destroy(project.mobileImage.public_id);
                } catch (err) {
                    console.error('Failed to destroy old mobileImage:', err);
                }
            }
            updateData.mobileImage = {
                url: req.files.mobileImage[0].path,
                public_id: req.files.mobileImage[0].filename || req.files.mobileImage[0].public_id,
            };
        }

        if (req.files?.clientLogo?.[0]) {
            if (project.clientLogo?.public_id) {
                try {
                    await cloudinary.uploader.destroy(project.clientLogo.public_id);
                } catch (err) {
                    console.error('Failed to destroy old clientLogo:', err);
                }
            }
            updateData.clientLogo = {
                url: req.files.clientLogo[0].path,
                public_id: req.files.clientLogo[0].filename || req.files.clientLogo[0].public_id,
            };
        } else if (req.body.removeClientLogo === 'true' || req.body.removeClientLogo === true) {
            if (project.clientLogo?.public_id) {
                try {
                    await cloudinary.uploader.destroy(project.clientLogo.public_id);
                } catch (err) {
                    console.error('Failed to destroy old clientLogo on removal:', err);
                }
            }
            updateData.clientLogo = null;
        }

        const updatedProject = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        res.status(200).json({ success: true, message: 'Project updated successfully', data: updatedProject });
    } catch (error) {
        console.error('updateProject error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ success: false, message: 'Validation Error', errors: messages });
        }
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (Admin only)
export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        // Purge files from Cloudinary
        const imagesToPurge = [
            project.desktopImage?.public_id,
            project.mobileImage?.public_id,
            project.clientLogo?.public_id,
        ].filter(Boolean);

        for (const publicId of imagesToPurge) {
            try {
                await cloudinary.uploader.destroy(publicId);
            } catch (err) {
                console.error(`Failed to destroy Cloudinary asset ${publicId}:`, err);
            }
        }

        await Project.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
        console.error('deleteProject error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
