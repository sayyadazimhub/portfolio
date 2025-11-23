import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { apiService } from '../../utils/api';

const Experience = () => {
    const [experiences, setExperiences] = useState([]);

    useEffect(() => {
        const fetchExperience = async () => {
            try {
                const response = await apiService.getExperience();
                setExperiences(response.data);
            } catch (error) {
                console.error('Error fetching experience:', error);
            }
        };

        fetchExperience();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    return (
        <section id="experience" className="py-24 bg-gradient-to-b from-secondary/30 to-primary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 pb-2 border-b-2 border-accent/30 inline-block">
                        Work Experience
                    </h2>
                    <p className="text-gray-400 mt-2">My professional journey</p>
                </motion.div>

                {/* Simple timeline */}
                <div className="relative border-l-2 border-accent/20 ml-4 md:ml-8 space-y-10">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative pl-8 md:pl-12 group"
                        >
                            {/* Simple timeline dot */}
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-accent border-4 border-primary"></div>

                            {/* Clean experience card */}
                            <div className="bg-secondary/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-accent/50 transition-all duration-300">
                                {/* Header */}
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-white mb-2">
                                            {exp.role}
                                        </h3>

                                        {/* Company */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <FaBriefcase className="text-accent" />
                                            <span className="font-semibold text-gray-200">{exp.company}</span>
                                        </div>

                                        {/* Location */}
                                        {exp.location && (
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <FaMapMarkerAlt className="text-sm" />
                                                <span className="text-sm">{exp.location}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Date badge */}
                                    <div className="flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-lg border border-accent/20">
                                        <FaCalendarAlt className="text-accent text-sm" />
                                        <span className="text-sm font-medium text-gray-200">
                                            {exp.startDate && exp.endDate
                                                ? `${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`
                                                : exp.period}
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                    {exp.description}
                                </p>

                                {/* Technologies */}
                                {exp.technologies && exp.technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {exp.technologies.map((tech, idx) => (
                                            <span
                                                key={idx}
                                                className="text-xs bg-accent/10 text-accent border border-accent/20 px-3 py-1 rounded-full hover:bg-accent/20 transition-colors"
                                            >
                                                {tech}
                                            </span>
                                        ))}
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

export default Experience;
