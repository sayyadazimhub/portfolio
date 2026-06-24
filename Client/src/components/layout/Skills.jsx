import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    FaReact: 'text-cyan-500 bg-cyan-50 border-cyan-100',
    FaNodeJs: 'text-green-500 bg-green-50 border-green-100',
    FaDatabase: 'text-amber-500 bg-amber-50 border-amber-100',
    FaCloud: 'text-blue-500 bg-blue-50 border-blue-100',
    FaTools: 'text-orange-500 bg-orange-50 border-orange-100',
    FaCode: 'text-purple-500 bg-purple-50 border-purple-100'
};

const defaultColor = 'text-indigo-500 bg-indigo-50 border-indigo-100';

const Skills = () => {
    const [skillCategories, setSkillCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await apiService.getSkills();
                const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
                
                let categories = [];
                if (data.length > 0 && data[0].skills) {
                    categories = data;
                } else {
                    // Fallback in case the API returns a flat list
                    categories = [{ title: 'All Skills', icon: 'FaTools', skills: data }];
                }
                setSkillCategories(categories);
            } catch (error) {
                console.error('Error fetching skills:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
    }, []);

    const hasNoSkills = !skillCategories || skillCategories.length === 0 || skillCategories.every(c => !c.skills || c.skills.length === 0);

    if (!loading && hasNoSkills) {
        return null;
    }

    return (
        <section id="skills" className="py-8 md:py-12 lg:py-16 bg-slate-50/50 relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-100/50 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-100/40 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-12">
                    <div className="flex-1">
                        <h2 
                            className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] mb-2 sm:mb-3 text-indigo-600 font-bold flex items-center gap-2"
                        >
                            {/* <span className="w-6 h-0.5 bg-indigo-600"></span> */}
                            My Expertise
                        </h2>
                        <h3 
                            className="text-3xl sm:text-4xl lg:text-5xl font-black text-black font-serif leading-[1.1] tracking-tight"
                        >
                            Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">Arsenal.</span>
                        </h3>
                    </div>
                    <p 
                        className="text-slate-800 max-w-md text-sm sm:text-base leading-relaxed text-justify md:text-left"
                    >
                        A comprehensive overview of the technologies, frameworks, and tools I use to bring ideas to life.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col gap-12 lg:gap-16 items-center relative">
                        <div className="w-full max-w-6xl mx-auto space-y-12">
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                                    {[...Array(10)].map((_, i) => (
                                        <div key={i} className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200 shadow-sm flex items-center gap-3">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-slate-200 animate-pulse shrink-0"></div>
                                            <div className="flex-1 h-4 bg-slate-300 rounded-md animate-pulse"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-12 lg:gap-16 items-center relative">
                        <div className="w-full max-w-6xl mx-auto space-y-12">
                            {skillCategories.map((category, catIdx) => {
                                const CatIcon = iconMap[category.icon] || FaCode;
                                
                                return (
                                    <div key={catIdx} className="space-y-6">
                                        {/* <div className="flex items-center gap-3">
                                            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                                                <CatIcon className="text-xl" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
                                                {category.title || category.category || 'Skills'}
                                            </h3>
                                        </div> */}
                                        
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                                            {(category.skills || []).map((skill, idx) => {
                                                const isImageUrl = skill.icon && (skill.icon.startsWith('http') || skill.icon.startsWith('/'));
                                                const SkillIcon = !isImageUrl ? (iconMap[skill.icon] || FaCode) : null;
                                                const colorClass = !isImageUrl ? (iconColors[skill.icon] || defaultColor) : defaultColor;
                                                
                                                return (
                                                <div 
                                                    key={skill._id || idx}
                                                    className="bg-white rounded-xl p-3 sm:p-4 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 sm:p-2.5 rounded-lg border ${colorClass} transition-colors duration-300 group-hover:scale-110 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 shrink-0 overflow-hidden`}>
                                                            {isImageUrl ? (
                                                                <img src={skill.icon} alt={skill.name} className="w-full h-full object-contain" />
                                                            ) : (
                                                                <SkillIcon className="text-lg sm:text-xl" />
                                                            )}
                                                        </div>
                                                        <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors text-sm sm:text-base tracking-tight truncate">
                                                            {skill.name}
                                                        </span>
                                                    </div>
                                                </div>
                                            )})}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Skills;
