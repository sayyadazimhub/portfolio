import { FaGithub, FaExternalLinkAlt, FaArrowRight } from 'react-icons/fa';

const ProjectCard = ({ project, index, onClick }) => {
    return (
        <div
            className="group flex flex-col h-full bg-white rounded-[2rem] border border-slate-100 shadow-md hover:shadow-xl hover:border-indigo-100 hover:-translate-y-1 transition-all duration-500 overflow-hidden cursor-pointer will-change-transform"
            onClick={onClick}
        >
            {/* Image Section */}
            <div className="relative w-full aspect-[16/8] bg-slate-100 overflow-hidden border-b border-slate-100">
                {/* Subtle ambient overlay without expensive mix-blend */}
                <div className="absolute inset-0 bg-slate-900/10 z-10 pointer-events-none transition-opacity duration-500 group-hover:opacity-0"></div>

                <img
                    src={project.desktopImage?.url || project.image || 'https://via.placeholder.com/600x400'}
                    alt={project.projectName || project.title}
                    loading="lazy"
                    className="w-full h-full object-fill object-top transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-105 relative z-0 will-change-transform"
                />

                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col flex-1 p-5 sm:p-6 bg-white z-20 relative">

                {/* Type Badge */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-4 h-[2px] bg-indigo-600"></div>
                    <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-indigo-600 uppercase">
                        {project.projectType || 'Case Study'}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-black text-black font-serif tracking-tight mb-2.5 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-1">
                    {project.projectName || project.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-600 leading-relaxed mb-6 line-clamp-2 flex-1 font-medium">
                    {project.description}
                </p>

                {/* Footer Section: Button & Links */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100/80">

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onClick) onClick(e);
                        }}
                        className="group/btn relative inline-flex items-center justify-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-mono text-[10px] uppercase tracking-[0.15em] font-bold shadow-md shadow-slate-900/10 hover:shadow-indigo-500/25 hover:bg-indigo-600 transition-all duration-300 overflow-hidden cursor-pointer"
                    >
                        <span className="relative z-10">Details</span>
                        <FaArrowRight className="relative z-10 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </button>

                    {/* Quick Links */}
                    <div className="flex items-center gap-1.5 shrink-0">
                        {project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 flex items-center justify-center border border-slate-100 text-slate-500 hover:text-black hover:bg-indigo-100 rounded-xl transition-all duration-300 cursor-pointer"
                                onClick={(e) => e.stopPropagation()}
                                aria-label="View Source Code"
                                title="View Source Code"
                            >
                                <FaGithub size={16} />
                            </a>
                        )}
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 flex items-center justify-center border border-slate-100 text-slate-500 hover:text-indigo-600 hover:bg-indigo-100 rounded-xl transition-all duration-300 cursor-pointer"
                                onClick={(e) => e.stopPropagation()}
                                aria-label="Visit Live URL"
                                title="Visit Live URL"
                            >
                                <FaExternalLinkAlt size={13} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
