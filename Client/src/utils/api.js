import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_PORTFOLIO_SERVER_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// API service methods
export const apiService = {
    // Projects
    getProjects: () => api.get('/projects'),

    // Skills
    getSkills: () => api.get('/skills'),

    // Experience
    getExperience: () => api.get('/experience'),

    // Education, Honors & Certifications
    getEducation: () => api.get('/education'),
    getCertificates: () => api.get('/certificates'),
    getAchievements: () => api.get('/achievements'),
    getResume: () => api.get('/resume'),

    // Contact
    sendContact: (data) => api.post('/contact', data),

    // About Me
    getAboutMe: () => api.get('/aboutme'),

    // Testimonials
    getTestimonials: (status) => api.get('/testimonials', { params: { status } }),
    postTestimonial: (formData) => api.post('/testimonials', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
};

export default api;
