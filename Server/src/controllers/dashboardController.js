import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import Contact from '../models/Contact.js';
import Testimonial from '../models/Testimonial.js';
import Achievement from '../models/Achievement.js';
import Certificate from '../models/Certificate.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalProjects,
      totalSkills,
      totalContacts,
      unreadContacts,
      totalTestimonials,
      totalAchievements,
      totalCertificates
    ] = await Promise.all([
      Project.countDocuments(),
      Skill.countDocuments(),
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'pending' }),
      Testimonial.countDocuments(),
      Achievement.countDocuments(),
      Certificate.countDocuments(),
    ]);

    const overviewData = [
      { name: 'Projects', value: totalProjects },
      { name: 'Skills', value: totalSkills },
      { name: 'Testimonials', value: totalTestimonials },
      { name: 'Achievements', value: totalAchievements },
      { name: 'Certificates', value: totalCertificates },
    ];

    const approvedTestimonials = await Testimonial.countDocuments({ status: 'approved' });
    const pendingTestimonials = await Testimonial.countDocuments({ status: 'pending' });
    const rejectedTestimonials = await Testimonial.countDocuments({ status: 'rejected' });
    
    const testimonialData = [
      { name: 'Approved', value: approvedTestimonials, fill: '#10b981' }, 
      { name: 'Pending', value: pendingTestimonials, fill: '#f59e0b' },
      { name: 'Rejected', value: rejectedTestimonials, fill: '#ef4444' },
    ];

    const readContactsCount = await Contact.countDocuments({ status: 'read' });
    const repliedContactsCount = await Contact.countDocuments({ status: 'replied' });

    const contactData = [
      { name: 'Pending', value: unreadContacts, fill: '#f43f5e' }, // rose-500
      { name: 'Read', value: readContactsCount, fill: '#3b82f6' }, // blue-500
      { name: 'Replied', value: repliedContactsCount, fill: '#8b5cf6' }, // violet-500
    ];

    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const recentProjects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalProjects,
          totalSkills,
          totalContacts,
          unreadContacts,
          totalTestimonials,
          totalAchievements,
          totalCertificates
        },
        charts: {
          overviewData,
          testimonialData,
          contactData
        },
        recent: {
          contacts: recentContacts,
          projects: recentProjects
        }
      }
    });

  } catch (error) {
    console.error('getDashboardStats error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
