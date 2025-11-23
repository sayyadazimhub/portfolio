import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaCalendarAlt, FaMapMarkerAlt, FaAward } from 'react-icons/fa';
import { apiService } from '../../utils/api';

const Education = () => {
    const [educationList, setEducationList] = useState([]);

    useEffect(() => {
        const fetchEducation = async () => {
            try {
                const response = await apiService.getEducation();
                setEducationList(response.data);
            } catch (error) {
                console.error('Error fetching education:', error);
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
            </div>
        </section>
    );
};

export default Education;
