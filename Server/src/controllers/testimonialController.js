import cloudinary from "../config/cloudinary.js";
import Testimonial from "../models/Testimonial.js";
import { getIO } from '../config/io.js';

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public

export const getTestimonials = async (req, res) => {
    try {
        const { status } = req.query;
        let query = { status: 'approved' };
        
        if (status) {
            query = status === 'all' ? {} : { status };
        }
        
        const testimonials = await Testimonial.find(query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, message: 'Testimonials retrieved successfully', data: testimonials });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    } finally {
        console.log('getTestimonials function executed');
    }
};

// @desc    Get a single testimonial by ID
// @route   GET /api/testimonials/:id
// @access  Public

export const getTestimonialById = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (!testimonial) {
            return res.status(404).json({ success: false, message: 'Testimonial not found' });
        }
        res.status(200).json({ success: true, message: 'Testimonial retrieved successfully', data: testimonial });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create a testimonial
// @route   POST /api/testimonials
// @access  Public  

export const createTestimonial = async (req, res) => {
  try {
    const testimonialData = {
      name: req.body.name,
      role: req.body.role,
      company: req.body.company,
      linkedInUrl: req.body.linkedInUrl,
      message: req.body.message,
    };

    if (req.body.status) {
      testimonialData.status = req.body.status;
    }

    if (req.file) {
      testimonialData.image = req.file.path; // Cloudinary URL
      testimonialData.cloudinaryId = req.file.filename || req.file.public_id;
    }

    const testimonial = await Testimonial.create(testimonialData);

    try {
      const io = getIO();
      io.to('admin-room').emit('new-testimonial', {
        id: testimonial._id,
        type: 'testimonial',
        name: testimonial.name,
        role: testimonial.role,
        company: testimonial.company,
        message: testimonial.message,
        linkedInUrl: testimonial.linkedInUrl,
        image: testimonial.image,
        createdAt: testimonial.createdAt,
      });
      console.log('✅ new-testimonial event emitted to admin-room');
    } catch (socketError) {
      console.error('❌ Socket.IO notification failed:', socketError.message);
    }

    res.status(201).json({ success: true, message: 'Testimonial created successfully', data: testimonial });
  } catch (error) {
    console.error('createTestimonial error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, message: 'Validation Error', errors: messages });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a testimonial
// @route   PUT /api/testimonials/:id
// @access  Public

export const updateTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (!testimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }

        const updateData = {
          name: req.body.name,
          role: req.body.role,
          company: req.body.company,
          linkedInUrl: req.body.linkedInUrl,
          message: req.body.message,
          status: req.body.status,
        };

        if (req.file) {
          const oldCloudinaryId = testimonial.cloudinaryId;
          try {
            if (oldCloudinaryId) {
              await cloudinary.uploader.destroy(oldCloudinaryId);
            }
          } catch (destroyError) {
            console.error('Failed to delete old testimonial image from Cloudinary:', destroyError);
          }

          updateData.image = req.file.path;
          updateData.cloudinaryId = req.file.filename || req.file.public_id;
        }

        const updatedTestimonial = await Testimonial.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        res.status(200).json({ success: true, message: 'Testimonial updated successfully', data: updatedTestimonial });
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ success: false, message: 'Validation Error', errors: messages });
        }
        res.status(500).json({ message: 'Server Error' });
    } finally {
        console.log('updateTestimonial function executed');
    }
};


// @desc    Delete a testimonial
// @route   DELETE /api/testimonials/:id
// @access  Public  


export const deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (!testimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }

        if (testimonial.cloudinaryId) {
          try {
            await cloudinary.uploader.destroy(testimonial.cloudinaryId);
          } catch (destroyError) {
            console.error('Failed to delete testimonial image from Cloudinary:', destroyError);
          }
        }

        await Testimonial.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Testimonial deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    } finally {
        console.log('deleteTestimonial function executed');
    }
};
