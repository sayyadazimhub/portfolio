import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_PORTFOLIO_SERVER_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache duration

const withCache = (key, fetcher) => {
    if (cache.has(key)) {
        const cached = cache.get(key);
        if (Date.now() < cached.expiry) {
            return cached.promise;
        }
        cache.delete(key);
    }
    
    const promise = fetcher().catch(err => {
        cache.delete(key);
        throw err;
    });

    cache.set(key, {
        promise,
        expiry: Date.now() + CACHE_TTL
    });

    return promise;
};

// API service methods
export const apiService = {
    // Projects
    getProjects: () => withCache('projects', () => api.get('/projects')),

    // Skills
    getSkills: () => withCache('skills', () => api.get('/skills')),

    // Experience
    getExperience: () => withCache('experience', () => api.get('/experience')),

    // Education, Honors & Certifications
    getEducation: () => withCache('education', () => api.get('/education')),
    getCertificates: () => withCache('certificates', () => api.get('/certificates')),
    getAchievements: () => withCache('achievements', () => api.get('/achievements')),
    getResume: () => withCache('resume', () => api.get('/resume')),

    // Contact
    sendContact: (data) => api.post('/contact', data),

    // About Me
    getAboutMe: () => withCache('aboutme', () => api.get('/aboutme')),

    // Testimonials
    getTestimonials: (status) => withCache(`testimonials_${status}`, () => api.get('/testimonials', { params: { status } })),
    postTestimonial: (formData) => api.post('/testimonials', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
};

export default api;
