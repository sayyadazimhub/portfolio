import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaCalendarAlt, FaMapMarkerAlt, FaAward } from 'react-icons/fa';
import axios from 'axios';

const Education = () => {
    const [educationList, setEducationList] = useState([]);

    useEffect(() => {
        const fetchEducation = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/education');
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
        <div className="mt-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
                <h3 className="text-3xl md:text-4xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-white via-accent to-purple-400 bg-clip-text text-transparent">
                        Education
                    </span>
                </h3>
                <div className="w-20 h-1 bg-gradient-to-r from-accent to-purple-500 mx-auto rounded-full"></div>
                <p className="text-gray-400 mt-3 text-base">My academic journey</p>
            </motion.div>

            <div className="relative border-l-2 border-gradient-to-b from-accent/30 via-purple-500/30 to-accent/30 ml-4 md:ml-8 space-y-10">
                {educationList.map((edu, index) => (
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

                        {/* Education Card */}
                        <div className="relative bg-gradient-to-br from-secondary/50 to-primary/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-accent/20 hover:border-accent/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-accent/10">
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>

                            {/* Header Section */}
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                                <div className="flex-1">
                                    <h4 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-accent bg-clip-text text-transparent mb-3">
                                        {edu.degree}
                                    </h4>

                                    <div className="flex flex-col gap-2">
                                        {/* Institution */}
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                                                <FaGraduationCap className="text-accent" />
                                            </div>
                                            <span className="font-semibold text-lg text-white">{edu.institution}</span>
                                        </div>

                                        {/* Location */}
                                        {edu.location && (
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                                    <FaMapMarkerAlt className="text-purple-400 text-sm" />
                                                </div>
                                                <span className="text-sm">{edu.location}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Date Range Badge */}
                                <div className="flex items-center gap-2 bg-gradient-to-r from-accent/10 to-purple-500/10 px-4 py-2.5 rounded-xl border border-accent/30 whitespace-nowrap">
                                    <FaCalendarAlt className="text-accent flex-shrink-0" />
                                    <span className="font-semibold text-white text-sm">
                                        {edu.startDate && edu.endDate
                                            ? `${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`
                                            : edu.period}
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            {edu.description && (
                                <p className="text-gray-300 leading-relaxed mb-4 text-base">
                                    {edu.description}
                                </p>
                            )}

                            {/* Grade/GPA */}
                            {edu.grade && (
                                <div className="flex items-center gap-2 mt-4">
                                    <FaAward className="text-accent" />
                                    <span className="text-gray-300">
                                        <span className="font-semibold text-accent">Grade:</span> {edu.grade}
                                    </span>
                                </div>
                            )}

                            {/* Achievements or Courses */}
                            {edu.achievements && edu.achievements.length > 0 && (
                                <div className="mt-6 pt-4 border-t border-accent/20">
                                    <h5 className="text-sm font-semibold text-accent mb-3 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                                        Key Achievements
                                    </h5>
                                    <div className="flex flex-wrap gap-2">
                                        {edu.achievements.map((achievement, idx) => (
                                            <span
                                                key={idx}
                                                className="text-xs font-medium bg-gradient-to-r from-accent/20 to-purple-500/20 border border-accent/30 text-gray-200 px-3 py-1.5 rounded-full hover:from-accent/30 hover:to-purple-500/30 hover:border-accent/50 transition-all duration-300 hover:scale-105"
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
    );
};

export default Education;
