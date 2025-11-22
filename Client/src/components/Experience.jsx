import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';

const Experience = () => {
    const [experiences, setExperiences] = useState([]);

    useEffect(() => {
        const fetchExperience = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/experience');
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
        <section id="experience" className="py-24 bg-gradient-to-b from-secondary/30 to-primary relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
            <div className="absolute top-20 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    {/* <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-white via-accent to-purple-400 bg-clip-text text-transparent">
                            Work Experience
                        </span>
                    </h2>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-accent to-purple-500 mx-auto rounded-full"></div>
                    <p className="text-gray-400 mt-4 text-lg">My professional journey</p> */}

                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-white via-accent to-purple-400 bg-clip-text text-transparent">
                            Work Experience
                        </span>
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-accent to-purple-500 mx-auto rounded-full"></div>
                    <p className="text-gray-400 mt-4">My professional journey.</p>
                </motion.div>

                <div className="relative border-l-2 border-gradient-to-b from-accent/30 via-purple-500/30 to-accent/30 ml-4 md:ml-8 space-y-12">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative pl-8 md:pl-12 group"
                        >
                            {/* Animated Timeline Dot */}
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gradient-to-r from-accent to-purple-500 border-4 border-primary shadow-lg shadow-accent/50 group-hover:scale-125 transition-transform duration-300">
                                <div className="absolute inset-0 rounded-full bg-accent animate-ping opacity-75"></div>
                            </div>

                            {/* Experience Card */}
                            <div className="relative bg-gradient-to-br from-secondary/50 to-primary/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-accent/20 hover:border-accent/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-accent/10">
                                {/* Glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>

                                {/* Header Section */}
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-accent bg-clip-text text-transparent mb-3">
                                            {exp.role}
                                        </h3>

                                        <div className="flex flex-col gap-2">
                                            {/* Company */}
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                                                    <FaBriefcase className="text-accent" />
                                                </div>
                                                <span className="font-semibold text-lg text-white">{exp.company}</span>
                                            </div>

                                            {/* Location */}
                                            {exp.location && (
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                                        <FaMapMarkerAlt className="text-purple-400 text-sm" />
                                                    </div>
                                                    <span className="text-sm">{exp.location}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Date Range Badge */}
                                    <div className="flex items-center gap-2 bg-gradient-to-r from-accent/10 to-purple-500/10 px-4 py-2.5 rounded-xl border border-accent/30 whitespace-nowrap">
                                        <FaCalendarAlt className="text-accent flex-shrink-0" />
                                        <span className="font-semibold text-white text-sm">
                                            {exp.startDate && exp.endDate
                                                ? `${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`
                                                : exp.period}
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-gray-300 leading-relaxed mb-4 text-base">
                                    {exp.description}
                                </p>

                                {/* Technologies */}
                                {exp.technologies && exp.technologies.length > 0 && (
                                    <div className="mt-6 pt-4 border-t border-accent/20">
                                        <h4 className="text-sm font-semibold text-accent mb-3 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                                            Technologies
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {exp.technologies.map((tech, idx) => (
                                                <span
                                                    key={idx}
                                                    className="text-xs font-medium bg-gradient-to-r from-accent/20 to-purple-500/20 border border-accent/30 text-gray-200 px-3 py-1.5 rounded-full hover:from-accent/30 hover:to-purple-500/30 hover:border-accent/50 transition-all duration-300 hover:scale-105"
                                                >
                                                    {tech}
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

export default Experience;
