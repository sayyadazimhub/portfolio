import 'dotenv/config';
import express from 'express';
// import serverless from "serverless-http";
import cors from 'cors';
import http from 'http';
import connectDB from './config/db.js';
import { initSocket } from './config/io.js';
import contactRoutes from './routes/contactRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import experienceRoutes from './routes/experienceRoutes.js';
import educationRoutes from './routes/educationRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import aboutMeRoutes from './routes/aboutMeRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://azim-sayyad-portfolio.vercel.app',
        'https://portfolio-admin-owiw.onrender.com',
        process.env.FRONTEND_URL,
        process.env.ADMIN_FRONTEND_URL,
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

// Default Route
app.get('/', (req, res) => {
    res.json({ message: 'Portfolio API is running...' });
});

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/aboutme', aboutMeRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// export default app used for vercel deployment
// export default serverless(app);
