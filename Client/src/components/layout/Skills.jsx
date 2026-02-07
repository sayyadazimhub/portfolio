import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaReact, FaNodeJs, FaDatabase, FaCloud, FaTools, FaCode } from 'react-icons/fa';
import { apiService } from '../../utils/api';

const iconMap = {
    FaReact: FaReact,
    FaNodeJs: FaNodeJs,
    FaDatabase: FaDatabase,
    FaCloud: FaCloud,
    FaTools: FaTools,
    FaCode: FaCode
};

const iconColors = {
    FaReact: 'text-cyan-400',
    FaNodeJs: 'text-green-400',
    FaDatabase: 'text-yellow-400',
    FaCloud: 'text-blue-400',
    FaTools: 'text-gray-400',
    FaCode: 'text-purple-400'
};

const Skills = () => {
    const [skillCategories, setSkillCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await apiService.getSkills();
                setSkillCategories(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching skills:', error);
                setError('Failed to load skills');
                setLoading(false);
            }
        };

        fetchSkills();
    }, []);

    return (
        <section id="skills" className="py-24 bg-gradient-to-b from-primary to-secondary/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 pb-2 border-b-2 border-accent/30 inline-block">
                        My Skills
                    </h2>
                    <p className="text-gray-400 mt-2">Technologies I work with</p>
                </motion.div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                viewport={{ once: true }}
                                className="group h-full"
                            >
                                <div className="h-full flex flex-col bg-secondary/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-accent/50 transition-all duration-300">
                                    {/* Skeleton Loader */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-gray-700 rounded-lg animate-pulse"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-5 bg-gray-700 rounded w-3/4 animate-pulse"></div>
                                            <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse"></div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="h-4 bg-gray-700 rounded w-1/3 animate-pulse"></div>
                                        <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse"></div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="h-4 bg-gray-700 rounded w-full animate-pulse"></div>
                                        <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse"></div>
                                        <div className="h-4 bg-gray-700 rounded w-4/5 animate-pulse"></div>
                                    </div>

                                    <div className="flex gap-2 mt-auto">
                                        <div className="h-8 w-20 bg-gray-700 rounded animate-pulse"></div>
                                        <div className="h-8 w-20 bg-gray-700 rounded animate-pulse"></div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    // <div className="flex justify-center items-center h-64">
                    //     <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent"></div>
                    // </div>
                ) : error ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center justify-center text-center py-20"
                    >
                        {/* Error Icon */}
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="text-red-500 text-6xl mb-4"
                        >
                            ⚠️
                        </motion.div>

                        {/* Error Code */}
                        <h1 className="text-5xl font-bold text-red-500 mb-2">
                            500
                        </h1>

                        {/* Title */}
                        <h2 className="text-xl font-semibold text-white mb-3">
                            Internal Server Error
                        </h2>

                        {/* Message */}
                        <p className="text-gray-400 max-w-md mb-6">
                            Something went wrong while loading your skills.
                            Please try again later.
                        </p>

                        {/* Retry Button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg transition"
                        >
                            Try Again
                        </motion.button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {skillCategories.map((category, index) => {
                            const IconComponent = iconMap[category.icon] || FaCode;
                            const iconColor = iconColors[category.icon] || 'text-gray-400';

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="group bg-secondary/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-accent/50 transition-all duration-300"
                                >
                                    <div className="flex flex-col items-center text-center">
                                        {/* Simple icon */}
                                        <div className="mb-4">
                                            <IconComponent className={`text-5xl ${iconColor} group-hover:scale-110 transition-transform duration-300`} />
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-lg font-bold text-white mb-4">
                                            {category.title}
                                        </h3>

                                        {/* Skills - Simple list */}
                                        <div className="flex flex-wrap justify-center gap-2">
                                            {category.skills.map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className="bg-accent/10 text-accent border border-accent/20 px-3 py-1 rounded-full text-xs hover:bg-accent/20 transition-colors"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Skills;
