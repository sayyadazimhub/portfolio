import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../utils/api';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const FeaturedProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await apiService.getProjects();
                const projectData = Array.isArray(res.data) ? res.data : (res.data?.data || []);
                const featuredProjects = projectData.filter(
                    project => (project.featured === true || project.featured === "true") && project.status === "Completed"
                );
                setProjects(featuredProjects.slice(0, 5));
            } catch (err) {
                console.error("Failed to load featured projects", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Autoplay logic
    useEffect(() => {
        if (!isPaused && projects.length > 0) {
            const timer = setInterval(() => {
                setCurrent((prev) => (prev < projects.length - 1 ? prev + 1 : 0));
            }, 3000);
            return () => clearInterval(timer);
        }
    }, [isPaused, projects.length, current]);

    if (!loading && projects.length === 0) {
        return null;
    }

    return (
        <section className="pt-8 md:pt-12 lg:pt-16 bg-white overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="flex flex-row items-end justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] mb-2 sm:mb-3 text-indigo-600 font-bold flex items-center gap-2"
                        >
                            {/* <span className="w-6 h-0.5 bg-indigo-600 shrink-0"></span> */}
                            <span className="truncate">Featured Work</span>
                        </motion.h2>
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-2xl sm:text-4xl lg:text-5xl font-black text-black font-serif leading-[1.1] tracking-tight truncate"
                        >
                            Curated <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">Archive.</span>
                        </motion.h3>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex shrink-0 mb-1 sm:mb-0"
                    >
                        <button onClick={() => navigate('/projects')} className="group inline-flex items-center justify-center gap-2 sm:gap-3 bg-white text-black border-2 border-black px-5 py-3 sm:px-6 sm:py-3.5 rounded-lg font-mono text-[10px] sm:text-xs uppercase tracking-[0.10em] font-bold hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 cursor-pointer">
                            <span className="hidden sm:inline">View All Projects</span>
                            <span className="sm:hidden">View All</span>
                            <FaArrowRight className="text-black group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-300" />
                        </button>
                    </motion.div>
                </div>

                {/* Loading Skeleton */}
                {loading && (
                    <div className="relative w-full py-10 overflow-hidden px-4 flex flex-col items-center justify-center">
                        <div className="relative w-full max-w-6xl h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] flex items-center justify-center">
                            <div className="w-[280px] sm:w-[400px] md:w-[600px] lg:w-[800px] h-full rounded-[2rem] md:rounded-[3rem] bg-slate-100 animate-pulse border border-slate-200 shadow-xl overflow-hidden flex flex-col relative">
                                <div className="absolute inset-0 bg-slate-100 opacity-50" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-300/50 via-slate-200/40 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-12 z-10 flex flex-col justify-end">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-16 sm:w-20 h-6 sm:h-8 bg-slate-300/80 rounded-full animate-pulse" />
                                        <div className="w-16 sm:w-20 h-6 sm:h-8 bg-slate-300/80 rounded-full animate-pulse" />
                                    </div>
                                    <div className="w-3/4 sm:w-2/3 h-8 sm:h-10 md:h-12 bg-slate-300/80 rounded-xl mb-4 animate-pulse" />
                                    <div className="w-full h-4 sm:h-5 bg-slate-300/60 rounded-md mb-2 animate-pulse" />
                                    <div className="w-5/6 h-4 sm:h-5 bg-slate-300/60 rounded-md mb-6 animate-pulse" />
                                    <div className="flex justify-between items-center mt-auto">
                                        <div className="flex gap-4">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-300/80 rounded-full animate-pulse" />
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-300/80 rounded-full animate-pulse" />
                                        </div>
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-300/80 rounded-full animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3D Cover-Flow Gallery */}
                {!loading && projects.length > 0 && (
                    <div className="relative w-full py-10 overflow-hidden px-4 flex flex-col items-center justify-center">
                        {/* Cards Container */}
                        <div
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                            className="relative w-full max-w-6xl h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] flex items-center justify-center"
                        >
                            {projects.map((project, index) => {
                                const len = projects.length;
                                let diff = index - current;

                                // Infinite Loop Logic
                                if (diff > len / 2) diff -= len;
                                if (diff < -len / 2) diff += len;

                                // Responsive 3D Logic
                                let translateX = 0;
                                let scale = 1;
                                let zIndex = 30;
                                let opacity = 1;

                                if (diff === 0) {
                                    translateX = 0;
                                    scale = 1;
                                    zIndex = 40;
                                    opacity = 1;
                                } else if (Math.abs(diff) === 1) {
                                    translateX = diff > 0 ? 20 : -20;
                                    scale = 0.85;
                                    zIndex = 20;
                                    opacity = 0.6;
                                } else {
                                    translateX = diff > 0 ? 100 : -100;
                                    scale = 0.7;
                                    zIndex = 10;
                                    opacity = 0;
                                }

                                return (
                                    <div
                                        key={project._id || index}
                                        className="absolute w-[85%] sm:w-[500px] md:w-[700px] lg:w-[900px] lg:h-[90%] md:h-[80%] sm:h-[70%] h-full transition-all duration-700 ease-out cursor-pointer"
                                        style={{
                                            transform: `translateX(${translateX}%) scale(${scale})`,
                                            zIndex: zIndex,
                                            opacity: opacity,
                                            pointerEvents: diff === 0 ? 'auto' : 'none',
                                        }}
                                        onClick={() => setCurrent(index)}
                                    >
                                        <div
                                            onClick={() => navigate(`/projects/${project._id}`)}
                                            className="relative w-full h-full rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-[3px] border-white hover:border-white transition-colors duration-500 group bg-white"
                                        >
                                            {/* Image Section - Full Background */}
                                            <div className="absolute inset-0 w-full h-full bg-slate-100 overflow-hidden">
                                                <div className="absolute inset-0 mix-blend-multiply z-10 pointer-events-none transition-opacity duration-500 group-hover:opacity-0"></div>
                                                <img
                                                    src={project.desktopImage?.url || project.image || 'https://via.placeholder.com/800x600'}
                                                    alt={project.projectName || project.title}
                                                    className="w-full h-full object-fill object-top transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-105 relative z-0"
                                                />
                                                {/* Protective Dark Gradient for Text Readability */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 pointer-events-none"></div>
                                            </div>

                                            {/* Content Section - Glassmorphism Overlay */}
                                            <div className="absolute bottom-0 left-0 right-0 flex flex-col p-4 sm:p-5 bg-white/20 backdrop-blur-[0.2px] border-t border-white/40 z-20 transition-colors duration-500">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex flex-col flex-1 min-w-0">
                                                        {/* Type Badge */}
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <div className="w-4 h-[2px] bg-indigo-600"></div>
                                                            <span className="font-mono text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-indigo-400 uppercase">
                                                                {project.projectType || 'Case Study'}
                                                            </span>
                                                        </div>

                                                        {/* Title */}
                                                        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white font-serif max-w-sm tracking-tight group-hover:text-indigo-400 transition-colors duration-300 line-clamp-1 drop-shadow-md">
                                                            {project.projectName || project.title}
                                                        </h3>

                                                        {/* Description */}
                                                        <p className="text-sm md:text-base text-white/90 leading-relaxed line-clamp-1 max-w-md font-medium drop-shadow-sm">
                                                            {project.description}
                                                        </p>
                                                    </div>

                                                    {/* Action Arrow */}
                                                    <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/30 bg-black/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-indigo-600 group-hover:border-white shadow-sm hover:shadow-md transition-all duration-300 ml-auto mt-auto backdrop-blur-sm">
                                                        <FaArrowRight className="w-3 h-3 md:w-4 md:h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Inactive cards overlay */}
                                            {diff !== 0 && (
                                                <div className="absolute inset-0 bg-slate-900/60 z-40 pointer-events-none transition-opacity duration-700 backdrop-blur-[2px]" />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Navigation Arrows */}
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 w-full max-w-[1400px] mx-auto flex justify-between px-2 sm:px-6 md:px-10 lg:px-16 z-[40] pointer-events-none">
                            <button
                                onMouseEnter={() => setIsPaused(true)}
                                onMouseLeave={() => setIsPaused(false)}
                                onClick={() => setCurrent((prev) => (prev > 0 ? prev - 1 : projects.length - 1))}
                                className="group relative flex items-center justify-center bg-white hover:bg-slate-50 text-black border border-slate-200 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full shadow-md hover:shadow-lg transition-all duration-300 pointer-events-auto cursor-pointer"
                            >
                                <FaArrowLeft className="text-indigo-500 w-3 h-3 md:w-4 md:h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                            </button>

                            <button
                                onMouseEnter={() => setIsPaused(true)}
                                onMouseLeave={() => setIsPaused(false)}
                                onClick={() => setCurrent((prev) => (prev < projects.length - 1 ? prev + 1 : 0))}
                                className="group relative flex items-center justify-center bg-white hover:bg-slate-50 text-black border border-slate-200 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full shadow-md hover:shadow-lg transition-all duration-300 pointer-events-auto cursor-pointer"
                            >
                                <FaArrowRight className="text-indigo-500 w-3 h-3 md:w-4 md:h-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Animations */}
            <style>{`
                .perspective-[1500px] {
                    perspective: 1500px;
                }
            `}</style>
        </section>
    );
};

export default FeaturedProjects;
