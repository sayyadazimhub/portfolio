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

    // Education
    getEducation: () => api.get('/education'),

    // Contact
    sendContact: (data) => api.post('/contact', data),
};

export default api;
