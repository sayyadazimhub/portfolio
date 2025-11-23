import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const ProjectCard = ({ project, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative h-full"
        >
            {/* Simple card with clean design */}
            <div className="relative h-full flex flex-col bg-secondary/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-accent/60 transition-all duration-300 hover:shadow-xl hover:shadow-accent/10">

                {/* Image Section */}
                <div className="relative overflow-hidden h-48">
                    <img
                        src={project.image || 'https://via.placeholder.com/600x400'}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Simple overlay on hover */}
                    <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6">
                        {project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-accent hover:scale-110 transition-all duration-300"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <FaGithub size={24} />
                            </a>
                        )}
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-accent hover:scale-110 transition-all duration-300"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <FaExternalLinkAlt size={24} />
                            </a>
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col p-6">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors">
                        {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2 flex-grow">
                        {project.description}
                    </p>

                    {/* Tech Stack - Simple pills */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                        {project.techStack.slice(0, 4).map((tech, idx) => (
                            <span
                                key={idx}
                                className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full border border-accent/20 hover:bg-accent/20 transition-colors"
                            >
                                {tech}
                            </span>
                        ))}
                        {project.techStack.length > 4 && (
                            <span className="text-xs bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full">
                                +{project.techStack.length - 4}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectCard;
