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

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await apiService.getSkills();
                setSkillCategories(response.data);
            } catch (error) {
                console.error('Error fetching skills:', error);
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
            </div>
        </section>
    );
};

export default Skills;
