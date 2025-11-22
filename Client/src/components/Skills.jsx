import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaReact, FaNodeJs, FaDatabase, FaCloud, FaTools, FaCode } from 'react-icons/fa';
import axios from 'axios';

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
                const response = await axios.get('http://localhost:5000/api/skills');
                setSkillCategories(response.data);
            } catch (error) {
                console.error('Error fetching skills:', error);
            }
        };

        fetchSkills();
    }, []);

    return (
        <section id="skills" className="py-24 bg-gradient-to-b from-primary to-secondary/30 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>

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
                            My Skills
                        </span>
                    </h2>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-accent to-purple-500 mx-auto rounded-full"></div>
                    <p className="text-gray-400 mt-4 text-lg">Technologies I work with</p> */}

                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-white via-accent to-purple-400 bg-clip-text text-transparent">
                            My Skills
                        </span>
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-accent to-purple-500 mx-auto rounded-full"></div>
                    <p className="text-gray-400 mt-4">Technologies I work with.</p>
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
                                className="group relative bg-gradient-to-br from-secondary/50 to-primary/50 backdrop-blur-sm p-6 rounded-2xl border border-accent/20 hover:border-accent/40 transition-all duration-300 hover:scale-105"
                            >
                                {/* Glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>

                                <div className="flex flex-col items-center text-center">
                                    {/* Icon with gradient background */}
                                    <div className="mb-4 p-4 bg-gradient-to-br from-accent/10 to-purple-500/10 rounded-xl border border-accent/20 group-hover:border-accent/40 transition-all duration-300">
                                        <IconComponent className={`text-5xl ${iconColor} group-hover:scale-110 transition-transform duration-300`} />
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-accent transition-colors">
                                        {category.title}
                                    </h3>

                                    <div className="flex flex-wrap justify-center gap-2">
                                        {category.skills.map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className="bg-gradient-to-r from-accent/20 to-purple-500/20 border border-accent/30 px-3 py-1.5 rounded-full text-sm text-gray-200 hover:from-accent/30 hover:to-purple-500/30 hover:border-accent/50 transition-all duration-300 hover:scale-105"
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
