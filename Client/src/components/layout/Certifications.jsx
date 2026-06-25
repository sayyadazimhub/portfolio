import { useState, useEffect } from 'react';
import { FaTrophy, FaCertificate, FaExternalLinkAlt, FaCalendarAlt, FaAward, FaMedal, FaCheckCircle, FaImage, FaTimes } from 'react-icons/fa';
import { apiService } from '../../utils/api';

const Certifications = () => {
    const [certificates, setCertificates] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

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

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-8 px-2 md:px-4">
                                    {certificates.map((cert, index) => (
                                        <div
                                            key={cert._id || index}
                                            className="group relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-200 hover:shadow-xl hover:border-indigo-200 transition-all duration-500"
                                        >
                                            {/* Full Certificate Image */}
                                            <div className="absolute inset-0 flex items-center justify-center p-5 sm:p-6 bg-slate-50/50 group-hover:bg-white transition-colors duration-500 z-0">
                                                {cert.certificateImage ? (
                                                    <img
                                                        src={cert.certificateImage}
                                                        alt={cert.title}
                                                        className="w-full h-full object-contain filter drop-shadow-sm group-hover:drop-shadow-md group-hover:scale-[1.03] transition-all duration-500 ease-out"
                                                    />
                                                ) : (
                                                    <FaCertificate className="text-7xl text-slate-200 group-hover:scale-110 group-hover:text-slate-300 transition-all duration-500" />
                                                )}
                                            </div>

                                            {/* Bottom Action Bar (Slides up on hover) */}
                                            <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md p-4 border-t border-slate-100 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-20 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
                                                <div className="flex flex-col pr-3 min-w-0">
                                                    <h3 className="text-sm font-bold text-slate-800 truncate mb-1">{cert.title}</h3>
                                                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{cert.issuer}</span>
                                                        {cert.credentialId && (
                                                            <span className="text-[9px] font-mono font-medium text-slate-500 bg-slate-100/80 px-1.5 py-0.5 rounded truncate max-w-[110px]">
                                                                ID: {cert.credentialId}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                {cert.credentialUrl ? (
                                                    <a
                                                        href={cert.credentialUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-9 h-9 shrink-0 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white hover:shadow-md transition-all duration-300"
                                                        title="View Credential"
                                                    >
                                                        <FaExternalLinkAlt size={12} />
                                                    </a>
                                                ) : (
                                                    <div className="w-9 h-9 shrink-0 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-sm" title="Verified">
                                                        <FaCheckCircle size={14} />
                                                    </div>
                                                )}
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

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-8">
                                    {achievements.map((achieve, index) => (
                                        <div
                                            key={achieve._id || index}
                                            className="group relative flex flex-col justify-between bg-white rounded-[2rem] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-slate-100 hover:border-indigo-100 transition-all duration-500 overflow-hidden z-10"
                                        >
                                            {/* Decorative Ambient Background */}
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>

                                            <div className="relative z-10 flex flex-col sm:flex-row gap-5 sm:gap-6 items-stretch">

                                                {/* Left side: Text Content */}
                                                <div className="flex flex-col flex-grow min-w-0">
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div className="shrink-0 w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center shadow-inner border border-indigo-100/50 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">
                                                            <FaMedal className="text-2xl text-indigo-500" />
                                                        </div>
                                                        <div className="flex flex-col justify-center min-w-0">
                                                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">
                                                                {achieve.issuer}
                                                            </span>
                                                            <h4 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2">
                                                                {achieve.title}
                                                            </h4>
                                                        </div>
                                                    </div>

                                                    {achieve.description && (
                                                        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                                                            {achieve.description}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* right side: Image Content */}
                                                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between shrink-0 gap-3 sm:gap-2 mt-2 sm:mt-0 w-full sm:w-auto border-t sm:border-t-0 border-slate-100 pt-4 sm:pt-0">
                                                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 uppercase tracking-widest shadow-sm">
                                                        {formatDate(achieve.date)}
                                                    </span>
                                                    {achieve.image && (
                                                        <div className="mt-auto">
                                                            <button
                                                                onClick={() => setSelectedImage(achieve.image)}
                                                                className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-50 hover:bg-indigo-600 group/btn transition-all duration-300 border border-indigo-100 hover:border-indigo-600 cursor-pointer shadow-sm"
                                                                title="View Image"
                                                            >
                                                                <FaImage className="text-indigo-500 group-hover/btn:text-white transition-colors text-base" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Image Popup Modal */}
            <>
                {selectedImage && (
                    <div
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-4xl w-full bg-slate-50 rounded-2xl overflow-hidden shadow-2xl border border-slate-800"
                        >
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-900/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-500 hover:text-white transition-colors duration-300 border border-white/20"
                            >
                                <FaTimes size={16} />
                            </button>
                            <img
                                src={selectedImage}
                                alt="Achievement Full Size"
                                className="w-full h-auto max-h-[80vh] object-contain"
                            />
                        </div>
                    </div>
                )}
            </>
        </section>
    );
};

export default Certifications;
