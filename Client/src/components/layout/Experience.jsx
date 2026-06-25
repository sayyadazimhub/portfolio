import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronRight, FaChevronLeft, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { apiService } from '../../utils/api';

const Experience = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const fetchExperience = async () => {
            try {
                const response = await apiService.getExperience();
                setExperiences(response.data || []);
            } catch (error) {
                console.error('Error fetching experience:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchExperience();
    }, []);

    const formatPeriod = (startDate, endDate, currentlyWorking) => {
        if (!startDate) return 'Date unavailable';

        const options = { year: 'numeric', month: 'short' };
        const startStr = new Date(startDate).toLocaleDateString('en-US', options);

        if (currentlyWorking || !endDate) {
            return `${startStr} — Present`;
        }

        const endStr = new Date(endDate).toLocaleDateString('en-US', options);
        return `${startStr} — ${endStr}`;
    };

    const activeExp = experiences[activeIndex];
    const nextExp = experiences[activeIndex + 1] || null;

    if (!loading && experiences.length === 0) {
        return null;
    }

    return (
        <section id="experience" className="py-12 md:py-16 bg-white relative">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Elegant Centered Header */}
                <div className="text-center max-w-3xl mx-auto">
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-black tracking-tight font-serif mb-4"
                    >
                        Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Journey</span>
                    </h2>

                    <div>
                        <p className="text-sm md:text-base text-slate-800 font-medium leading-relaxed max-w-2xl mx-auto">
                            A timeline of my professional experience, highlighting key roles, responsibilities, and the impact I've driven across different organizations.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="w-full">
                        {/* Skeleton Timeline Track */}
                        <div className="mb-2 md:mb-6 w-full relative py-6 md:py-8">
                            <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 md:left-4 md:right-4 h-[2px] bg-slate-100 z-0"></div>
                            <div className="flex justify-between items-center relative z-10 px-2 md:px-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2">
                                        <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full ${i === 0 ? 'bg-slate-200 ring-4 ring-slate-50 scale-125' : 'bg-slate-100'} animate-pulse`}></div>
                                        <div className="w-10 h-3 bg-slate-100 rounded-sm mt-4 animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Skeleton Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                            {/* Active Experience Skeleton */}
                            <div className="md:col-span-2 bg-white border border-slate-200 shadow-sm p-5 md:p-8 rounded-3xl min-h-[300px] md:min-h-[350px] flex flex-col">
                                <div className="w-32 h-6 bg-slate-200 rounded-full mb-6 animate-pulse"></div>
                                <div className="w-2/3 h-8 md:h-10 bg-slate-300 rounded-xl mb-3 animate-pulse"></div>
                                <div className="w-1/3 h-6 bg-slate-200 rounded-lg mb-8 animate-pulse"></div>
                                <div className="space-y-3 mb-8 flex-grow">
                                    <div className="w-full h-4 bg-slate-200 rounded-md animate-pulse"></div>
                                    <div className="w-full h-4 bg-slate-200 rounded-md animate-pulse"></div>
                                    <div className="w-4/5 h-4 bg-slate-200 rounded-md animate-pulse"></div>
                                </div>
                                <div className="flex gap-2 mt-auto pt-6 border-t border-slate-100">
                                    <div className="w-16 h-6 bg-slate-200 rounded-lg animate-pulse"></div>
                                    <div className="w-20 h-6 bg-slate-200 rounded-lg animate-pulse"></div>
                                    <div className="w-14 h-6 bg-slate-200 rounded-lg animate-pulse"></div>
                                </div>
                            </div>
                            {/* Next Experience Preview Skeleton */}
                            <div className="hidden md:flex md:col-span-1 bg-slate-50 border border-slate-200 p-4 md:p-8 rounded-3xl flex-col justify-center min-h-[350px]">
                                <div className="w-32 h-4 bg-slate-300 rounded-md mb-6 animate-pulse"></div>
                                <div className="w-full h-6 bg-slate-300 rounded-lg mb-2 animate-pulse"></div>
                                <div className="w-2/3 h-5 bg-slate-200 rounded-md mb-8 animate-pulse"></div>
                                <div className="w-24 h-3 bg-slate-200 rounded-md mt-auto animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        {/* Horizontal Timeline Track */}
                        <div className="mb-2 md:mb-6 w-full">
                            <div className="relative py-6 md:py-8">
                                {/* Background Line */}
                                <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 md:left-4 md:right-4 h-[2px] bg-slate-100 z-0"></div>
                                {/* Active Progress Line */}
                                <div
                                    className="absolute top-1/2 -translate-y-1/2 left-2 md:left-4 h-[2px] bg-indigo-600 z-0 transition-all duration-500 ease-out"
                                    style={{ width: `calc(${(activeIndex / (experiences.length - 1 || 1)) * 100}% - ${(experiences.length > 1 && activeIndex === experiences.length - 1) ? '16px' : '0px'})` }}
                                ></div>

                                <div className="flex justify-between items-center relative z-10 px-2 md:px-4">
                                    {experiences.map((exp, idx) => {
                                        const isActive = idx === activeIndex;
                                        const isPast = idx < activeIndex;
                                        const year = exp.startDate ? new Date(exp.startDate).getFullYear() : '';
                                        return (
                                            <div key={idx} className="relative flex flex-col items-center">
                                                <button
                                                    onClick={() => setActiveIndex(idx)}
                                                    className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-[3px] md:border-[4px] transition-all duration-300 cursor-pointer ${isActive ? 'bg-white border-indigo-600 ring-2 md:ring-4 ring-indigo-100 scale-125' :
                                                            isPast ? 'bg-indigo-600 border-indigo-600 hover:scale-110' : 'bg-white border-slate-200 hover:border-slate-300 hover:scale-110'
                                                        }`}
                                                />
                                                <span className={`absolute top-6 md:top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] sm:text-[11px] md:text-xs font-bold uppercase tracking-wider md:tracking-widest transition-colors duration-300 ${isActive ? 'text-indigo-600' : 'text-slate-600'}`}>
                                                    {year}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Interactive Cards Grid */}
                        <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-3">
                            {/* Active Experience */}
                            <div className="md:col-span-2 w-full max-w-4xl bg-white border border-slate-300 shadow-xl shadow-slate-100 p-5 md:p-8 rounded-3xl relative overflow-hidden flex flex-col">


                                {/* Mobile Next Button (Right Middle) */}
                                {nextExp && (
                                    <button
                                        onClick={() => setActiveIndex(activeIndex + 1)}
                                        className="md:hidden absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-white shadow-md hover:shadow-lg border border-slate-200 rounded-full text-black hover:bg-slate-50 transition-all duration-300 cursor-pointer"
                                    >
                                        <FaChevronRight className="ml-0.5" />
                                    </button>
                                )}

                                {/* Previous Button (Left Middle on mobile, Right Middle on md+) */}
                                {activeIndex > 0 && (
                                    <button
                                        onClick={() => setActiveIndex(activeIndex - 1)}
                                        className="absolute left-3 md:left-auto md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-white shadow-md hover:shadow-lg border border-slate-200 rounded-full text-black hover:bg-slate-50 transition-all duration-300 cursor-pointer"
                                        title="Previous Experience"
                                    >
                                        <FaChevronLeft className="-ml-0.5" />
                                    </button>
                                )}

                                    <div
                                        key={activeIndex}
                                        className="flex flex-col h-full"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            {activeExp.employmentType && (
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="text-[10px] md:text-xs font-mono font-bold px-2.5 py-1 bg-slate-100 text-slate-800 uppercase rounded-md tracking-wider">
                                                        {activeExp.employmentType}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 shadow-sm text-slate-800 w-fit transition-colors hover:border-slate-300">
                                                {activeExp.currentlyWorking || !activeExp.endDate ? (
                                                    <span className="relative flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                                    </span>
                                                ) : (
                                                    <FaCalendarAlt className="text-slate-600 text-[10px] sm:text-[11px]" />
                                                )}
                                                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                                                    {formatPeriod(activeExp.startDate, activeExp.endDate, activeExp.currentlyWorking)}
                                                </span>
                                            </div>
                                        </div>

                                        <h3 className="text-2xl md:text-4xl font-serif font-bold text-black mb-2 leading-tight">
                                            {activeExp.jobTitle}
                                        </h3>

                                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4 mb-1">
                                            <div className="text-lg md:text-xl text-black italic font-serif">
                                                {activeExp.company}
                                            </div>
                                        </div>

                                        {activeExp.location && (
                                            <div className="text-sm font-serif font-semibold text-slate-600 flex items-center gap-1.5 mt-1 mb-6">
                                                <FaMapMarkerAlt className="text-indigo-500" /> {activeExp.location}
                                            </div>
                                        )}

                                        {activeExp.description && (
                                            <p className="text-slate-800 text-base md:text-md leading-relaxed font-medium">
                                                {activeExp.description}
                                            </p>
                                        )}
                                    </div>
                            </div>

                            {/* Next Experience Preview (Span 1) */}
                            {nextExp ? (
                                <div
                                    key={`preview-${activeIndex}`}
                                    onClick={() => {
                                        setActiveIndex(activeIndex + 1);
                                        // Optional: scroll slightly to ensure the active card is fully visible on mobile
                                        document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                                    }}
                                    className="hidden md:flex md:col-span-1 bg-slate-50 border border-slate-200 p-4 md:p-8 rounded-2xl md:rounded-3xl cursor-pointer hover:bg-white hover:border-indigo-300 hover:shadow-xl transition-all duration-300 group flex-col justify-center relative overflow-hidden h-full"
                                >
                                    <div className="hidden md:block absolute right-[-20px] bottom-[-20px] text-indigo-500/5 group-hover:text-indigo-500/10 transition-colors duration-500">
                                        <FaChevronRight size={140} className="md:w-[180px] md:h-[180px]" />
                                    </div>

                                    <div className="relative z-10 w-full flex flex-row md:flex-col items-center md:items-start justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] md:text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1 md:mb-6 flex items-center gap-2">
                                                Previous Experience <FaChevronRight className="hidden md:inline group-hover:translate-x-1 transition-transform" />
                                            </span>
                                            <h3 className="text-lg md:text-2xl font-serif font-bold text-black mb-0 md:mb-2 leading-snug">
                                                {nextExp.jobTitle}
                                            </h3>
                                            <p className="hidden md:block text-slate-600 italic font-serif mb-6 md:mb-8 text-base md:text-lg">
                                                {nextExp.company}
                                            </p>
                                        </div>

                                        <div className="md:hidden w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors shrink-0">
                                            <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
                                        </div>

                                        <div className="hidden md:block text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest group-hover:text-indigo-500 transition-colors">
                                            Click to advance
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    key="preview-end"
                                    className="hidden md:flex md:col-span-1 border border-slate-300 p-4 md:p-8 rounded-2xl md:rounded-3xl flex-col justify-center relative overflow-hidden h-full"
                                >
                                    <div className="relative z-10 w-full flex flex-col items-center md:items-start justify-center h-full text-center md:text-left opacity-85">
                                        <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 md:mb-6 flex items-center gap-2">
                                            End of Timeline
                                        </span>
                                        <h3 className="text-lg md:text-xl font-serif font-bold text-black/95 mb-0 md:mb-2 leading-snug">
                                            You've reached the start.
                                        </h3>
                                        <p className="hidden md:block text-slate-500 font-medium mt-4 text-sm md:text-base">
                                            These are all my documented professional experiences so far.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Experience;
