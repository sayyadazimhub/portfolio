import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaCalendarAlt, FaAward, FaUniversity } from 'react-icons/fa';
import { apiService } from '../../utils/api';

const Education = () => {
    const [educationList, setEducationList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEducation = async () => {
            try {
                const response = await apiService.getEducation();
                // Ensure we reliably extract the array of records
                const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
                setEducationList(data);
            } catch (error) {
                console.error('Error fetching education:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEducation();
    }, []);

    const formatPeriod = (startDate, endDate) => {
        if (!startDate) return 'Date unavailable';
        const options = { year: 'numeric', month: 'short' };
        const startStr = new Date(startDate).toLocaleDateString('en-US', options);

        if (!endDate) {
            return `${startStr} — Present`;
        }

        const endStr = new Date(endDate).toLocaleDateString('en-US', options);
        return `${startStr} — ${endStr}`;
    };

    if (!loading && educationList.length === 0) {
        return null;
    }

    return (
        <section id="education" className="py-12 md:py-16 bg-slate-50 relative overflow-hidden">
            {/* Soft background accents */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-100/40 blur-3xl" />
                <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-purple-100/40 blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Elegant Centered Header */}
                <div className="text-center max-w-3xl mx-auto mb-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tight font-serif mb-4"
                    >
                        Academic <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Background</span>
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <p className="text-sm md:text-base text-slate-800 font-light leading-relaxed max-w-2xl mx-auto">
                            My educational journey and the academic foundations that have shaped my professional career.
                        </p>
                    </motion.div>
                </div>

                {loading ? (
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-10">
                            <div className="flex items-center gap-3 mb-6 px-2">
                                <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse shrink-0"></div>
                                <div className="h-6 w-48 bg-slate-200 animate-pulse rounded-md"></div>
                            </div>
                            <div className="bg-white p-5 sm:p-7 md:p-8 rounded-3xl sm:rounded-[2rem] border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-4 sm:gap-5 mb-5 md:mb-6 pb-5 border-b border-slate-50">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[1rem] bg-slate-100 animate-pulse shrink-0"></div>
                                    <div className="flex-1 space-y-3">
                                        <div className="h-6 w-2/3 bg-slate-100 animate-pulse rounded-md"></div>
                                        <div className="flex gap-3">
                                            <div className="h-4 w-32 bg-slate-100 animate-pulse rounded-md"></div>
                                            <div className="h-4 w-24 bg-slate-100 animate-pulse rounded-md"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3 mt-4">
                                    <div className="h-4 w-full bg-slate-50 animate-pulse rounded-md"></div>
                                    <div className="h-4 w-full bg-slate-50 animate-pulse rounded-md"></div>
                                    <div className="h-4 w-3/4 bg-slate-50 animate-pulse rounded-md"></div>
                                </div>
                            </div>
                        </div>
                        <div className="relative pt-6">
                            <div className="flex items-center gap-3 mb-8 px-2">
                                <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse shrink-0"></div>
                                <div className="h-6 w-56 bg-slate-200 animate-pulse rounded-md"></div>
                            </div>
                            <div className="space-y-6">
                                {[...Array(2)].map((_, i) => (
                                    <div key={i} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">
                                        <div className="flex gap-4 sm:gap-5">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 animate-pulse shrink-0 hidden sm:block"></div>
                                            <div className="flex-1 space-y-3">
                                                <div className="h-5 w-3/4 bg-slate-100 animate-pulse rounded-md"></div>
                                                <div className="h-4 w-1/2 bg-slate-50 animate-pulse rounded-md"></div>
                                                <div className="h-4 w-1/3 bg-slate-50 animate-pulse rounded-md"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : educationList.length > 0 ? (
                    <div className="max-w-4xl mx-auto">

                        {/* Highest Qualification Section */}
                        <div className="mb-10">
                            <div className="flex items-center gap-3 mb-6 px-2">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                    <FaAward size={20} />
                                </div>
                                <h3 className="text-2xl font-bold text-black font-serif">Highest Qualification</h3>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="bg-white p-5 sm:p-7 md:p-8 rounded-3xl sm:rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-indigo-100 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 transition-opacity group-hover:opacity-100 pointer-events-none"></div>

                                    <div className="relative z-10">
                                        {/* Card Header: Icon, Title, Institution, and Date */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-5 mb-5 md:mb-6 pb-5 md:pb-6 border-b border-slate-100">

                                            <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                                                <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0">
                                                    <div className="absolute inset-0 bg-indigo-200/60 rounded-[1rem] transform translate-x-1 translate-y-1 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:translate-y-1.5"></div>
                                                    <div className="absolute inset-0 bg-white border-2 border-indigo-100 rounded-[1rem] flex items-center justify-center z-10 transition-colors duration-300 group-hover:border-indigo-300">
                                                        <FaGraduationCap className="text-2xl sm:text-3xl text-indigo-600 transition-transform duration-300" />
                                                    </div>
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="text-2xl md:text-3xl font-serif font-black text-black leading-snug sm:whitespace-normal mb-1.5">
                                                        {educationList[0].degree}
                                                    </h4>
                                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-1 text-sm sm:text-base font-medium text-slate-600">
                                                        <div className="flex items-center gap-1.5 text-indigo-600 text-base font-bold sm:text-lg tracking-wider">
                                                            <span className="font-serif">{educationList[0].institution}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-start sm:items-end self-start sm:self-center shrink-0 mt-2 sm:mt-0">
                                                <div className="text-[9px] sm:text-[10px] font-bold text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg uppercase tracking-widest border border-slate-200 shadow-sm flex items-center gap-1.5">
                                                    <FaCalendarAlt className="text-slate-600" />
                                                    {formatPeriod(educationList[0].startDate, educationList[0].endDate)}
                                                </div>
                                            </div>

                                        </div>

                                        {/* Description */}
                                        {educationList[0].description && (
                                            <div className="relative mb-5 md:mb-6 bg-slate-50/80 rounded-md p-4 sm:p-5 border border-slate-100">
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-l-md"></div>
                                                <p className="text-slate-800 leading-relaxed text-sm sm:text-base font-medium">
                                                    {educationList[0].description}
                                                </p>
                                            </div>
                                        )}

                                        {/* Bottom Meta Tags */}
                                        {(educationList[0].fieldOfStudy || educationList[0].grade) && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-5 border-t border-slate-100/60 pt-4">
                                                {educationList[0].fieldOfStudy && (
                                                    <div className="group/meta font-mono flex items-start gap-3.5 bg-white p-3.5 sm:p-4 rounded-2xl border border-indigo-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] transition-all duration-300">
                                                        <div className="mt-0.5 bg-indigo-50/50 group-hover:bg-indigo-100/50 p-2.5 rounded-xl text-gray-500 group-hover:text-indigo-600 transition-all duration-300">
                                                            <FaGraduationCap size={18} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-600 mb-1">Specialization</p>
                                                            <p className="text-sm sm:text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-300 leading-tight">{educationList[0].fieldOfStudy}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {educationList[0].grade && (
                                                    <div className="group/meta font-mono flex items-start gap-3.5 bg-white p-3.5 sm:p-4 rounded-2xl border border-amber-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] transition-all duration-300">
                                                        <div className="mt-0.5 bg-amber-50/50 group-hover:bg-amber-100/50 p-2.5 rounded-xl text-gray-500 group-hover:text-amber-600 transition-all duration-300">
                                                            <FaAward size={18} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-600 mb-1">Grade / Score</p>
                                                            <p className="text-sm sm:text-base font-semibold text-slate-900 group-hover:text-amber-400 transition-colors duration-300 leading-tight">{educationList[0].grade}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Other Qualifications */}
                        {educationList.length > 1 && (
                            <div>
                                <div className="flex items-center gap-3 mb-6 px-2">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                                        <FaGraduationCap size={18} />
                                    </div>
                                    <h3 className="text-xl font-bold text-black font-serif">Previous Education</h3>
                                </div>

                                <div className="space-y-5">
                                    {educationList.slice(1).map((edu, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.4, delay: index * 0.1 }}
                                        >
                                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 group">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                                                    <div className="flex-grow">
                                                        <h4 className="text-lg md:text-xl flex items-center gap-2 font-bold font-serif text-black mb-1 transition-colors">
                                                            {edu.degree}
                                                        </h4>
                                                        <div className="text-sm sm:text-base font-medium text-slate-800">
                                                            {edu.institution}
                                                        </div>

                                                        {(edu.fieldOfStudy || edu.grade) && (
                                                            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mt-4">
                                                                {edu.fieldOfStudy && (
                                                                    <span className="text-[10px] sm:text-sm font-mono font-bold uppercase tracking-wider text-slate-600 bg-white border border-slate-200/80 px-3 sm:px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 hover:border-slate-300 transition-colors">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                                                                        {edu.fieldOfStudy}
                                                                    </span>
                                                                )}
                                                                {edu.grade && (
                                                                    <span className="text-[10px] sm:text-sm font-mono font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100/80 px-3 sm:px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 hover:border-indigo-200 transition-colors">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
                                                                        Score: {edu.grade}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="shrink-0 flex flex-col items-start md:items-end gap-2 md:pl-6 md:border-l border-slate-100">
                                                        <div className="text-[9px] font-bold text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg uppercase tracking-widest border border-slate-200 shadow-sm flex items-center gap-1.5">
                                                            <FaCalendarAlt className="text-slate-500" />
                                                            {formatPeriod(edu.startDate, edu.endDate)}
                                                        </div>
                                                        <div className="w-8 h-8 md:flex rounded-full bg-slate-50 hidden items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                                                            <FaGraduationCap />
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-600">
                            <FaGraduationCap size={24} />
                        </div>
                        <p className="text-slate-500 text-base">No educational records available yet.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Education;
