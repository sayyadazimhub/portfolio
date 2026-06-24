import Contact from '../models/Contact.js';
import sendEmail from '../lib/mail.js';
import { getIO } from '../config/io.js';
import { getAdminNotificationTemplate, getVisitorConfirmationTemplate } from '../lib/mailTemplates.js';

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            const errors = [];
            if (!name) errors.push('Please enter your name');
            if (!email) errors.push('Please enter your email');
            if (!subject) errors.push('Please enter a subject');
            if (!message) errors.push('Please enter a message');
            return res.status(400).json({ success: false, message: 'Validation Error', errors });
        }

        const contact = await Contact.create({
            name,
            email,
            subject,
            message,
        });

        // Emit socket event to admin room for real-time notification
        try {
            const io = getIO();
            console.log('📤 Emitting new-contact event to admin-room');
            io.to('admin-room').emit('new-contact', {
                id: contact._id,
                name: contact.name,
                email: contact.email,
                subject: contact.subject,
                message: contact.message,
                createdAt: contact.createdAt,
            });
            console.log('✅ new-contact event emitted successfully');
        } catch (socketError) {
            console.error('❌ Socket.IO notification failed:', socketError.message);
        }

        // Return immediate response to the client so it doesn't hang
        res.status(201).json({ success: true, message: 'Contact form submitted successfully', data: contact });

        // Process emails asynchronously in the background
        (async () => {
            try {
                // 1. Send HTML email notification to Admin
                const adminEmailHtml = getAdminNotificationTemplate({ name, email, subject, message });
                const adminEmailResult = await sendEmail({
                    to: process.env.EMAIL_USER,
                    subject: subject ? `New Inquiry: ${subject}` : 'New Portfolio Contact Submission',
                    text: `New contact form submission from ${name} (${email}):\n\nSubject: ${subject || 'No Subject'}\nMessage: ${message}`,
                    html: adminEmailHtml,
                });

                // 2. Send HTML auto-reply confirmation email to Visitor
                const visitorEmailHtml = getVisitorConfirmationTemplate({
                    name,
                    subject,
                    message,
                    frontendUrl: process.env.FRONTEND_URL,
                });
                const visitorEmailResult = await sendEmail({
                    to: email,
                    subject: subject ? `Inquiry Received: ${subject}` : 'Thank you for reaching out!',
                    text: `Hello ${name},\n\nThank you for getting in touch! I have successfully received your message: "${subject || 'No Subject'}" and will get back to you shortly.\n\nBest regards,\nSayyad Azim`,
                    html: visitorEmailHtml,
                });

                if (!adminEmailResult.success) {
                    console.error('Contact saved but admin email notification failed:', adminEmailResult.error);
                }
                if (!visitorEmailResult.success) {
                    console.error('Contact saved but visitor auto-reply email failed:', visitorEmailResult.error);
                }
            } catch (backgroundError) {
                console.error('Error during background email processing:', backgroundError);
            }
        })();

    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ success: false, message: 'Validation Error', errors: messages });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getContact = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: contacts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const updateContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json({ success: true, data: contact });
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ success: false, message: 'Validation Error', errors: messages });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

export const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json({ success: true, message: 'Contact deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};