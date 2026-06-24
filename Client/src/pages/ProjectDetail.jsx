import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../utils/api';
import ProjectCard from '../components/layout/ProjectCard';
import {
    FaArrowLeft,
    FaGithub,
    FaExternalLinkAlt,
    FaCalendarAlt,
    FaDatabase,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaBuilding,
    FaMapMarkerAlt,
    FaCode,
    FaFolderOpen,
    FaArrowUp,
    FaArrowRight
} from 'react-icons/fa';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [relatedProjects, setRelatedProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showTopBtn, setShowTopBtn] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 400) {
                setShowTopBtn(true);
            } else {
                setShowTopBtn(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await apiService.getProjects();
                const allProjects = Array.isArray(res.data) ? res.data : (res.data?.data || []);
                const completedProjects = allProjects.filter((p) => p.status === "Completed");
                const found = completedProjects.find(p => (p._id || p.id) === id);

                if (found) {
                    setProject(found);
                    let related = completedProjects.filter(p => (p._id || p.id) !== id && (p.projectType === found.projectType || p.projectCategory === found.projectCategory));
                    if (related.length < 3) {
                        const more = completedProjects.filter(p => (p._id || p.id) !== id && !related.some(r => (r._id || r.id) === (p._id || p.id)));
                        related = [...related, ...more];
                    }
                    setRelatedProjects(related.slice(0, 3));
                } else {
                    setError('Project not found');
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to load project details');
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    if (loading) {
        return (
            <section className="bg-slate-50 pt-10 pb-14 relative overflow-hidden">
                <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 relative z-10">
                    <div className="mb-4 flex px-2">
                        <div className="w-32 h-8 bg-slate-200 rounded-xl animate-pulse"></div>
                    </div>
                    
                    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-100">
                        {/* Header Skeleton */}
                        <div className="px-6 sm:px-8 py-8 sm:py-10 border-b border-slate-100 bg-white flex flex-col md:flex-row gap-6 sm:gap-8">
                            <div className="flex flex-col space-y-4 md:w-3/4">
                                <div className="w-24 h-4 bg-slate-200 rounded-md animate-pulse"></div>
                                <div className="w-3/4 h-10 md:h-14 bg-slate-200 rounded-xl animate-pulse"></div>
                                <div className="w-1/2 h-10 md:h-14 bg-slate-200 rounded-xl animate-pulse"></div>
                            </div>
                            <div className="hidden md:flex md:w-1/4 justify-end">
                                <div className="w-24 h-24 bg-slate-200 rounded-2xl animate-pulse"></div>
                            </div>
                        </div>

                        {/* Image Skeleton */}
                        <div className="w-full aspect-[16/9] lg:aspect-[21/9] bg-slate-200 animate-pulse border-b border-slate-100"></div>

                        {/* Body Skeleton */}
                        <div className="px-6 sm:px-8 py-8 md:py-12 flex flex-col lg:flex-row gap-12">
                            {/* Main Content */}
                            <div className="lg:w-2/3 space-y-10">
                                <div className="space-y-4">
                                    <div className="w-1/3 h-6 bg-slate-300 rounded-md animate-pulse mb-6"></div>
                                    <div className="w-full h-4 bg-slate-200 rounded animate-pulse"></div>
                                    <div className="w-full h-4 bg-slate-200 rounded animate-pulse"></div>
                                    <div className="w-5/6 h-4 bg-slate-200 rounded animate-pulse"></div>
                                    <div className="w-4/6 h-4 bg-slate-200 rounded animate-pulse"></div>
                                </div>
                            </div>

                            {/* Sidebar Info */}
                            <div className="lg:w-1/3 space-y-8">
                                <div className="p-6 rounded-2xl bg-slate-100 border border-slate-200 space-y-6">
                                    <div className="w-1/2 h-5 bg-slate-300 rounded-md animate-pulse"></div>
                                    <div className="flex gap-2">
                                        <div className="w-16 h-8 bg-slate-200 rounded-full animate-pulse"></div>
                                        <div className="w-16 h-8 bg-slate-200 rounded-full animate-pulse"></div>
                                        <div className="w-16 h-8 bg-slate-200 rounded-full animate-pulse"></div>
                                    </div>
                                    <div className="w-full h-px bg-slate-200"></div>
                                    <div className="flex gap-4">
                                        <div className="w-full h-12 bg-slate-200 rounded-xl animate-pulse"></div>
                                        <div className="w-full h-12 bg-slate-200 rounded-xl animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (error || !project) {
        return (
            <section className="bg-slate-50 pt-10 pb-14 relative overflow-hidden flex items-center justify-center">
                <div
                    className="text-center p-12 sm:p-16 bg-white rounded-[2rem] border border-rose-100 shadow-sm flex flex-col items-center justify-center max-w-2xl mx-auto w-full mx-4"
                >
                    <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center border border-rose-100 shadow-sm mb-6">
                        <span className="text-rose-500 text-2xl">⚠️</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 font-serif mb-2 tracking-tight">
                        Unable to load project
                    </h3>
                    <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed mb-8">
                        {error || "We couldn't find the requested project. It may have been removed or doesn't exist."}
                    </p>
                    <button
                        onClick={() => navigate('/projects')}
                        className="px-8 py-3 bg-slate-900 text-white font-mono text-xs uppercase tracking-widest font-bold rounded-xl shadow-lg hover:bg-rose-500 transition-colors cursor-pointer"
                    >
                        Back to Projects
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-slate-50 min-h-screen pt-5 pb-14 relative overflow-hidden">
            {/* Soft background grid pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

            <div
                className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 relative z-10 text-slate-700"
            >
                {/* Navigation and Actions */}
                <nav className="mb-4 flex px-2" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2">
                        <li className="inline-flex items-center">
                            <button
                                onClick={() => navigate('/projects')}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 hover:shadow-sm font-mono text-[10px] uppercase tracking-widest font-bold transition-all duration-300 cursor-pointer"
                            >
                                <FaArrowLeft size={12} />
                                <span>Back To Projects</span>
                            </button>
                        </li>
                    </ol>
                </nav>

                {/* Main Container Card */}
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-100">

                    {/* Profile Header */}
                    <div className="relative px-6 sm:px-8 py-8 sm:py-10 border-b border-slate-100 bg-white overflow-hidden">
                        {/* Minimalist Grid Pattern Background */}
                        <div className="absolute inset-0 z-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

                        <div className="flex flex-col md:flex-row items-start justify-between gap-6 sm:gap-8 relative z-10 max-w-6xl mx-auto">
                            {/* Left: Text & Info */}
                            <div className="flex flex-col space-y-4 md:w-3/4 mt-2 md:mt-0">
                                <div>
                                    <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                                        {project.projectType || 'Full Stack'}
                                    </div>
                                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-black font-serif tracking-tight leading-[1.1]">
                                        {project.projectName || project.title}
                                    </h1>
                                </div>

                                {project.clientName && (
                                    <div className="flex flex-row flex-wrap items-center gap-5 pt-4 border-t border-slate-100 mt-2">
                                        {/* Mobile-only Logo */}
                                        {project.clientLogo?.url && (
                                            <div className="md:hidden flex items-center mb-1 shrink-0">
                                                <div className="h-16 w-16 relative group">
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-2xl rotate-3 opacity-20 shadow-sm"></div>
                                                    <div className="absolute inset-0 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex items-center justify-center p-2">
                                                        <img
                                                            src={project.clientLogo.url}
                                                            alt="Client brand"
                                                            className="h-full w-full object-contain"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {project.clientName && (
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 font-mono">Client</p>
                                                <p className="text-sm font-bold text-slate-800">{project.clientName}</p>
                                            </div>
                                        )}
                                        {project.clientCity && (
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 font-mono">Location</p>
                                                <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                                                    {project.clientCity}
                                                </p>
                                            </div>
                                        )}
                                        {project.projectCategory && (
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 font-mono">Category</p>
                                                <p className="text-sm font-bold text-slate-800">{project.projectCategory}</p>
                                            </div>
                                        )}
                                        {project.projectType && (
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 font-mono">Type</p>
                                                <p className="text-sm font-bold text-slate-800">{project.projectType}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Right: Abstract/Logo (Desktop Only) */}
                            {project.clientLogo?.url && (
                                <div className="hidden md:flex md:w-1/4 justify-end">
                                    <div className="h-24 w-24 sm:h-32 sm:w-32 relative group shrink-0">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-3xl rotate-6 group-hover:rotate-12 transition-transform duration-500 opacity-20 shadow-xl"></div>
                                        <div className="absolute inset-0 bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden flex items-center justify-center p-4 transform group-hover:-translate-y-1 transition-transform duration-500">
                                            <img
                                                src={project.clientLogo.url}
                                                alt="Client brand"
                                                className="h-full w-full object-contain"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/*Project Details */}
                    <div className="p-6 sm:p-8">
                        <div className="grid gap-8 grid-cols-1">
                            {/* Device Visual Mockups Showcase */}
                            {(project.desktopImage?.url || project.mobileImage?.url || project.image) && (
                                <div className="space-y-6">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Device Preview Assets</h3>
                                    <div className="flex flex-col md:flex-row gap-8 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-100 items-center lg:items-start justify-center">

                                        {/* Laptop Mockup */}
                                        {project.desktopImage?.url ? (
                                            <div className="w-full md:w-[70%] mx-auto">
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider text-center mb-2">Desktop Mockup</p>
                                                <div className="relative border-[3.5px] border-slate-800 rounded-t-lg overflow-hidden bg-slate-950 w-full shadow-xl">
                                                    <img
                                                        src={project.desktopImage.url}
                                                        alt="Desktop layout"
                                                        className="h-full w-full object-fill"
                                                    />
                                                </div>
                                                {/* Base stand */}
                                                <div className="w-16 h-3 bg-slate-800 mx-auto" />
                                                <div className="w-24 h-1.5 bg-slate-900 mx-auto rounded-b shadow-inner" />
                                            </div>
                                        ) : (project.image && !project.mobileImage?.url) ? (
                                            <div className="w-full max-w-sm mx-auto col-span-1 sm:col-span-2">
                                                <div className="relative rounded-xl overflow-hidden bg-slate-100 shadow-xl border border-slate-200 aspect-video">
                                                    <img
                                                        src={project.image}
                                                        alt="Project cover"
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-xs font-semibold text-slate-500 text-center py-8 bg-slate-100/50 rounded-xl hidden sm:block">No desktop layout</div>
                                        )}


                                        {/* Smartphone Mockup */}
                                        {project.mobileImage?.url && (
                                            <div className="w-full md:w-[30%] flex flex-col items-center justify-end mx-auto">
                                                <div className="w-full max-w-[180px]">
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider text-center mb-2">Mobile Mockup</p>
                                                    <div className="relative border-[3.5px] rounded-md border-slate-800 overflow-hidden bg-slate-950 shadow-xl">
                                                        <div className="aspect-[9/18]">
                                                            <img
                                                                src={project.mobileImage.url}
                                                                alt="Mobile layout"
                                                                className="h-full w-full object-fill"
                                                            />
                                                            {/* <div className='absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-black z-10'></div> */}
                                                        </div>
                                                        {/* Mobile Navigation Bar */}
                                                        <div className="h-4 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center gap-6 border-t border-slate-800/50">
                                                            <svg className="w-2 h-2 text-slate-500" viewBox="0 0 24 24" fill="currentColor"><polygon points="19,4 5,12 19,20" /></svg>
                                                            <svg className="w-2 h-2 text-slate-500" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8" /></svg>
                                                            <svg className="w-2 h-2 text-slate-500" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="2" /></svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}



                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/*Content */}
                    <div className="p-6 sm:p-8">
                        <div className="grid gap-8 lg:grid-cols-3">


                            {/* Left Column: Visual Mockups & Core Description */}
                            <div className="lg:col-span-2 space-y-6">

                                {/* Description */}
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Description</h3>
                                    <p className="text-slate-950 text-base leading-relaxed whitespace-pre-line font-medium">
                                        {project.description}
                                    </p>
                                </div>

                            </div>

                            {/* Right Column: Metadata & External Actions */}
                            <div className="space-y-6 lg:col-span-1 lg:border-r lg:border-slate-100 lg:pr-8">



                                {/* Resource Links */}
                                {(project.liveUrl || project.githubUrl) && (
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">Project Assets</h3>
                                        <div className="space-y-2">
                                            {project.liveUrl && (
                                                <a
                                                    href={project.liveUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-3 text-sm font-bold text-white shadow-md shadow-indigo-600/10 transition-all cursor-pointer"
                                                >
                                                    <FaExternalLinkAlt /> Visit Live Website
                                                </a>
                                            )}
                                            {project.githubUrl && (
                                                <a
                                                    href={project.githubUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-black hover:bg-black/90 px-4 py-3 text-sm font-bold text-white shadow-md transition-all cursor-pointer"
                                                >
                                                    <FaGithub /> GitHub Repository
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}



                                {/* Technologies stack */}
                                {((project.technologies || project.techStack) || []).length > 0 && (
                                    <div className="pt-6 border-t border-slate-100 mt-6">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">Technologies & Tools</h3>
                                        <div className="flex flex-wrap gap-2.5">
                                            {((project.technologies || project.techStack) || []).map((tech, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-flex items-center gap-2 text-xs bg-white text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg font-bold shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-md hover:border-indigo-200 hover:text-indigo-600 transition-all cursor-default group"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>

                        </div>
                    </div>

                </div>

                {/* Related Projects Section */}
                {relatedProjects.length > 0 && (
                    <div className="hidden md:block pt-10">
                        <div className="flex items-center justify-between mb-8 sm:mb-10">
                            <h2 className="text-2xl sm:text-3xl font-black text-black font-serif tracking-tight">Similar Works</h2>
                            <button onClick={() => navigate('/projects')} className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-black/80 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 shadow-sm transition-all duration-300 text-sm font-bold cursor-pointer ">All Archive <FaArrowRight size={12} /></button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
                            {relatedProjects.map((p, index) => (
                                <div
                                    key={p._id || p.id}
                                    onClick={() => {
                                        navigate(`/projects/${p._id || p.id}`);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="col-span-1 group cursor-pointer p-4 rounded-xl border border-slate-200 hover:border-indigo-600 bg-slate-50 shadow-lg hover:shadow-2xl transition-all duration-500 ease-out flex flex-col"
                                >
                                    <div className="relative aspect-[16/8] rounded-lg overflow-hidden mb-4 bg-slate-100 shadow-[inset_4px_4px_8px_#e2e8f0,inset_-4px_-4px_8px_#ffffff]">
                                        <img
                                            src={p.desktopImage?.url || p.image || 'https://via.placeholder.com/600x400'}
                                            alt={p.projectName || p.title}
                                            className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-103"
                                        />
                                        <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent transition-colors duration-500"></div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-black font-serif tracking-tight group-hover:text-indigo-600 transition-colors line-clamp-1 px-2 pb-1">
                                            {p.projectName || p.title}
                                        </h3>
                                        {/* social links */}
                                        {p.github && (
                                            <a href={p.github} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer">
                                                <FaGithub /> GitHub Repository
                                            </a>
                                        )}
                                        {p.live && (
                                            <a href={p.live} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer">
                                                <FaLive /> Live Link
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Return to Top Button */}
                {showTopBtn && (
                    <div
                        className="fixed bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 z-50 flex justify-center"
                    >
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-black border border-slate-700 text-white hover:bg-indigo-600 hover:border-indigo-500 shadow-xl shadow-slate-900/20 font-mono text-[10px] sm:text-xs uppercase tracking-widest font-bold transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                        >
                            <FaArrowUp size={12} />
                            <span>Return to Top</span>
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProjectDetail;
