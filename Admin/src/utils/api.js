import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_PORTFOLIO_SERVER_API_URL || 'http://localhost:5000/api',
});

// API service methods
export const apiService = {
    // Projects
    getProjects: () => api.get('/projects'),
    getProjectById: (id) => api.get(`/projects/${id}`),
    createProject: (formData) => api.post('/projects', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    updateProject: (id, formData) => api.put(`/projects/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    deleteProject: (id) => api.delete(`/projects/${id}`),

    // Skills
    getSkills: (params = {}) => api.get('/skills', { params }),
    getSkillsAdmin: () => api.get('/skills', { params: { admin: true } }),
    getSkillById: (id) => api.get(`/skills/${id}`),
    createSkill: (formData) => api.post('/skills', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    updateSkill: (id, formData) => api.put(`/skills/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    deleteSkill: (id) => api.delete(`/skills/${id}`),

    // Experience
    getExperience: () => api.get('/experience'),
    getExperienceAdmin: () => api.get('/experience', { params: { admin: true } }),
    getExperienceById: (id) => api.get(`/experience/${id}`),
    createExperience: (data) => api.post('/experience', data),
    updateExperience: (id, data) => api.put(`/experience/${id}`, data),
    deleteExperience: (id) => api.delete(`/experience/${id}`),

    // Education
    getEducation: () => api.get('/education'),
    getEducationAdmin: () => api.get('/education', { params: { admin: true } }),
    getEducationById: (id) => api.get(`/education/${id}`),
    createEducation: (data) => api.post('/education', data),
    updateEducation: (id, data) => api.put(`/education/${id}`, data),
    deleteEducation: (id) => api.delete(`/education/${id}`),

    // Contact
    getContacts: () => api.get('/contact'),
    createContact: (data) => api.post('/contact', data),
    updateContact: (id, data) => api.put(`/contact/${id}`, data),
    deleteContact: (id) => api.delete(`/contact/${id}`),
    sendContact: (data) => api.post('/contact', data),

    // Testimonials
    getTestimonials: (status = 'all') => api.get('/testimonials', { params: { status } }),
    getTestimonialById: (id) => api.get(`/testimonials/${id}`),
    createTestimonial: (formData) => api.post('/testimonials', formData),
    updateTestimonial: (id, formData) => api.put(`/testimonials/${id}`, formData),
    deleteTestimonial: (id) => api.delete(`/testimonials/${id}`),

    // Resume
    getResume: () => api.get('/resume'),
    getResumeAdmin: () => api.get('/resume', { params: { admin: true } }),
    getResumeById: (id) => api.get(`/resume/${id}`),
    createResume: (formData) => api.post('/resume', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    updateResume: (id, formData) => api.put(`/resume/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    deleteResume: (id) => api.delete(`/resume/${id}`),

    // AboutMe
    getAboutMe: () => api.get('/aboutme'),
    getAboutMeAdmin: () => api.get('/aboutme', { params: { admin: true } }),
    getAboutMeById: (id) => api.get(`/aboutme/${id}`),
    createAboutMe: (formData) => api.post('/aboutme', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    updateAboutMe: (id, formData) => api.put(`/aboutme/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    deleteAboutMe: (id) => api.delete(`/aboutme/${id}`),

    // Achievements
    getAchievements: () => api.get('/achievements'),
    getAchievementsAdmin: () => api.get('/achievements', { params: { admin: true } }),
    getAchievementById: (id) => api.get(`/achievements/${id}`),
    createAchievement: (formData) => api.post('/achievements', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    updateAchievement: (id, formData) => api.put(`/achievements/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    deleteAchievement: (id) => api.delete(`/achievements/${id}`),

    // Certificates
    getCertificates: () => api.get('/certificates'),
    getCertificatesAdmin: () => api.get('/certificates', { params: { admin: true } }),
    getCertificateById: (id) => api.get(`/certificates/${id}`),
    createCertificate: (formData) => api.post('/certificates', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    updateCertificate: (id, formData) => api.put(`/certificates/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    deleteCertificate: (id) => api.delete(`/certificates/${id}`),

    // Dashboard
    getDashboardStats: () => api.get('/dashboard'),
};

export default api;
