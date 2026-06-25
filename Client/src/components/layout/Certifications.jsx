import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaCertificate, FaExternalLinkAlt, FaCalendarAlt, FaAward, FaMedal, FaCheckCircle } from 'react-icons/fa';
import { apiService } from '../../utils/api';

const Certifications = () => {
    const [certificates, setCertificates] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [certRes, achRes] = await Promise.all([
                    apiService.getCertificates(),
                    apiService.getAchievements()
                ]);

                setCertificates(Array.isArray(certRes.data) ? certRes.data : (certRes.data?.data || []));
                setAchievements(Array.isArray(achRes.data) ? achRes.data : (achRes.data?.data || []));
            } catch (error) {
                console.error('Error fetching honors and certifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    if (!loading && certificates.length === 0 && achievements.length === 0) {
        return null;
    }

    return (
        <section id="honors-certifications" className="py-12 md:py-16 relative bg-slate-50 overflow-hidden">
            {/* Background Ambient Glows */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-200/40 blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-200/40 blur-[120px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Elegant Centered Header */}
                <div className="text-center max-w-3xl mx-auto mb-8">
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-200 text-indigo-700 font-bold tracking-widest uppercase text-xs mb-3"
                    >
                        <FaMedal className="text-indigo-500 text-sm" />
                        Milestones
                    </div>

                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tight font-serif mb-4"
                    >
                        Honors & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Credentials</span>
                    </h2>

                    <p
                        className="text-sm md:text-base text-slate-800 font-medium max-w-2xl mx-auto"
                    >
                        A showcase of continuous learning, professional certifications, and recognized achievements throughout my career.
                    </p>
                </div>

                {loading ? (
                    <div className="space-y-12">
                        <div>
                            <div className="w-64 h-8 bg-slate-200 rounded-lg animate-pulse mb-6"></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="bg-white rounded-[2rem] shadow-sm border border-slate-200 flex flex-col h-[380px] p-8 relative overflow-hidden">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="w-20 h-6 bg-slate-300 rounded-full animate-pulse"></div>
                                            <div className="w-24 h-5 bg-slate-200 rounded-md animate-pulse"></div>
                                        </div>
                                        <div className="mb-4">
                                            <div className="w-24 h-3 bg-slate-200 rounded-sm mb-2 animate-pulse"></div>
                                            <div className="w-3/4 h-6 bg-slate-300 rounded-md animate-pulse"></div>
                                        </div>
                                        <div className="w-full h-px bg-slate-100 mb-5"></div>
                                        <div className="mb-8">
                                            <div className="w-16 h-3 bg-slate-200 rounded-sm mb-2 animate-pulse"></div>
                                            <div className="w-1/2 h-5 bg-slate-300 rounded-md animate-pulse"></div>
                                        </div>
                                        <div className="mt-auto">
                                            <div className="w-20 h-3 bg-slate-200 rounded-sm mb-2 animate-pulse"></div>
                                            <div className="w-24 h-4 bg-slate-300 rounded-md animate-pulse"></div>
                                        </div>
                                        <div className="absolute bottom-8 right-8 w-10 h-10 bg-slate-200 rounded-full animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">

                        {/* Certificates Grid */}
                        {certificates.length > 0 && (
                            <div className="relative">
                                <div className="flex items-center justify-between mb-6 relative z-10">
                                    <h3
                                        className="text-2xl font-black text-black tracking-tight font-serif relative"
                                    >
                                        Professional Certifications
                                        <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {certificates.map((cert, index) => (
                                        <div
                                            key={cert._id || index}
                                            className="group relative bg-white rounded-[2rem] shadow-sm hover:shadow-xl border border-slate-200/60 hover:border-indigo-300 transition-all duration-500 overflow-hidden flex flex-col"
                                        >
                                            {/* Background Image (Visible on hover) */}
                                            {cert.certificateImage && (
                                                <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out pointer-events-none overflow-hidden rounded-[2rem] bg-white">
                                                    <img
                                                        src={cert.certificateImage}
                                                        alt={cert.title}
                                                        className="absolute inset-0 w-full h-full object-contain p-2 scale-95 group-hover:scale-100 transition-transform duration-700 ease-out drop-shadow-sm"
                                                    />
                                                    {/* Soft vignette overlay */}
                                                    <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.1)] rounded-[2rem]"></div>
                                                </div>
                                            )}

                                            {/* Front Content */}
                                            <div className="relative z-10 flex flex-col h-full p-8">
                                                {/* Decorative Corner element */}
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-50/50 to-transparent rounded-tr-[2rem] opacity-50 pointer-events-none"></div>

                                                {/* Fading Content */}
                                                <div className={`flex flex-col flex-grow transition-all duration-500 ease-out origin-top ${cert.certificateImage ? 'group-hover:opacity-0 group-hover:-translate-y-2' : ''}`}>
                                                    <div className="flex items-center justify-between mb-6">
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest border border-emerald-100/50 shadow-sm">
                                                            <FaCheckCircle className="text-emerald-500" />
                                                            Verified
                                                        </span>
                                                        {cert.credentialId && (
                                                            <span className="text-[9px] font-mono font-medium text-slate-600 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md border border-slate-100 truncate max-w-[120px]" title={cert.credentialId}>
                                                                ID: {cert.credentialId}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="mb-4">
                                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Certification</p>
                                                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">{cert.title}</h3>
                                                    </div>

                                                    <div className="w-full h-px bg-gradient-to-r from-slate-200 via-slate-100 to-transparent mb-5"></div>

                                                    <div className="mb-8">
                                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Issuer</p>
                                                        <h4 className="text-lg font-serif font-bold text-slate-800 leading-snug">{cert.issuer}</h4>
                                                    </div>

                                                    <div className="mt-auto">
                                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Issue Date</p>
                                                        <p className="text-sm font-medium text-slate-900">{formatDate(cert.issueDate)}</p>
                                                    </div>
                                                </div>

                                                {/* Non-fading Icon Button */}
                                                <div className="absolute bottom-8 right-8 z-20">
                                                    {cert.credentialUrl ? (
                                                        <a
                                                            href={cert.credentialUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-200 shadow-sm transition-all duration-300 hover:scale-110 hover:bg-blue-500 hover:border-blue-500 cursor-pointer group-hover:bg-blue-500 group-hover:border-blue-500"
                                                        >
                                                            <FaExternalLinkAlt className="text-slate-500 text-sm transition-colors duration-300 group-hover:text-white" />
                                                        </a>
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-200 shadow-sm transition-all duration-300 group-hover:bg-blue-500 group-hover:border-blue-500">
                                                            <FaAward className="text-slate-400 text-lg transition-colors duration-300 group-hover:text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Achievements - Compact Badges Layout */}
                        {achievements.length > 0 && (
                            <div className="relative pt-6">
                                <div className="flex items-center justify-between mb-6 relative z-10">
                                    <h3
                                        className="text-2xl font-black text-black tracking-tight font-serif relative"
                                    >
                                        Milestones & Recognitions
                                        <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 relative z-10">
                                    {achievements.map((achieve, index) => (
                                        <div
                                            key={achieve._id || index}
                                            className="group relative bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden flex flex-col h-full"
                                        >
                                            {/* Decorative Background */}
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-full opacity-50 group-hover:from-indigo-100 transition-colors duration-500"></div>

                                            <div className="flex justify-between items-start mb-5 relative z-10">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                                                    <FaAward className="text-indigo-500 text-xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                                                </div>
                                                <span className="text-[9px] font-bold text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg uppercase tracking-widest border border-slate-100 shadow-sm">
                                                    {formatDate(achieve.date)}
                                                </span>
                                            </div>

                                            <div className="relative z-10 flex-grow flex flex-col">
                                                <h4 className="text-lg font-bold text-slate-900 mb-1 leading-tight group-hover:text-indigo-700 transition-colors duration-300">
                                                    {achieve.title}
                                                </h4>
                                                <p className="text-[10px] font-bold text-indigo-600 mb-4 uppercase tracking-widest flex items-center gap-1.5">
                                                    <span className="w-3 h-[2px] bg-indigo-500 rounded-full"></span>
                                                    {achieve.issuer}
                                                </p>

                                                {achieve.description && (
                                                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mt-auto pt-4 border-t border-slate-100">
                                                        {achieve.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Certifications;
