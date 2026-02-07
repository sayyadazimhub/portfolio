import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaCalendarAlt, FaMapMarkerAlt, FaAward } from 'react-icons/fa';
import { apiService } from '../../utils/api';

const Education = () => {
    const [educationList, setEducationList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEducation = async () => {
            try {
                const response = await apiService.getEducation();
                setEducationList(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching education:', error);
                setError('Failed to load education');
                setLoading(false);
            }
        };

        fetchEducation();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    return (
        <section id="education" className="py-24 bg-gradient-to-b from-primary to-secondary/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 pb-2 border-b-2 border-accent/30 inline-block">
                        Education
                    </h3>
                    <p className="text-gray-400 mt-2">My academic journey</p>
                </motion.div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[...Array(4)].map((_, index) => (
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
                                    <div className="flex items-start gap-3 mb-4">
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
                            Something went wrong while loading your education.
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {educationList.map((edu, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                viewport={{ once: true }}
                                className="group h-full"
                            >
                                {/* Simple clean card */}
                                <div className="h-full flex flex-col bg-secondary/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-accent/50 transition-all duration-300">
                                    {/* Header */}
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                                            <FaGraduationCap className="text-2xl text-accent" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-xl font-bold text-white mb-1">
                                                {edu.degree}
                                            </h4>
                                            <p className="text-gray-300 font-medium">{edu.institution}</p>
                                        </div>
                                    </div>

                                    {/* Location & Date */}
                                    <div className="flex flex-wrap gap-3 mb-4 text-sm">
                                        {edu.location && (
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <FaMapMarkerAlt className="text-accent" />
                                                <span>{edu.location}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <FaCalendarAlt className="text-accent" />
                                            <span>
                                                {edu.startDate && edu.endDate
                                                    ? `${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`
                                                    : edu.period}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {edu.description && (
                                        <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                            {edu.description}
                                        </p>
                                    )}

                                    {/* Grade */}
                                    {edu.grade && (
                                        <div className="flex items-center gap-2 mb-4">
                                            <FaAward className="text-accent" />
                                            <span className="text-sm text-gray-300">
                                                <span className="font-semibold text-accent">Grade:</span> {edu.grade}
                                            </span>
                                        </div>
                                    )}

                                    {/* Achievements */}
                                    {edu.achievements && edu.achievements.length > 0 && (
                                        <div className="mt-auto pt-4 border-t border-gray-700/50">
                                            <div className="flex flex-wrap gap-2">
                                                {edu.achievements.map((achievement, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="text-xs bg-accent/10 text-accent border border-accent/20 px-3 py-1 rounded-full hover:bg-accent/20 transition-colors"
                                                    >
                                                        {achievement}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Education;
