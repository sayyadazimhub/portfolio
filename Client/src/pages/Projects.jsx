import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import ProjectCard from '../components/ProjectCard';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get('/projects');
                setProjects(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to load projects');
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16 pt-20" // pt-10 before
            >
                {/* <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">My Projects</h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    A collection of my work, ranging from web applications to cloud integrations.
                </p> */}
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-white via-accent to-purple-400 bg-clip-text text-transparent">
                        My Projects
                    </span>
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-accent to-purple-500 mx-auto rounded-full"></div>
                <p className="text-gray-400 mt-4">A collection of my work, ranging from web applications to cloud integrations.</p>
            </motion.div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent"></div>
                </div>
            ) : error ? (
                <div className="text-center text-red-400 text-xl">
                    {error}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <ProjectCard key={project._id} project={project} index={index} />
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default Projects;
