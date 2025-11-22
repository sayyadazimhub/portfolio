import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const ProjectCard = ({ project, index }) => {
    

return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
        className="bg-secondary/30 rounded-xl overflow-hidden border border-gray-700 hover:border-accent transition-all duration-300 hover:shadow-xl hover:shadow-accent/10 group"
    >
        <div className="relative overflow-hidden h-48">
            <img
                src={project.image || 'https://via.placeholder.com/600x400'}
                alt={project.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                {project.githubUrl && (
                    <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-primary rounded-full text-white hover:text-accent hover:bg-white transition-colors"
                    >
                        <FaGithub size={20} />
                    </a>
                )}
                {project.liveUrl && (
                    <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-primary rounded-full text-white hover:text-accent hover:bg-white transition-colors"
                    >
                        <FaExternalLinkAlt size={20} />
                    </a>
                )}
            </div>
        </div>

        <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors">
                {project.title}
            </h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
                {project.techStack.slice(0, 3).map((tech, idx) => (
                    <span
                        key={idx}
                        className="text-xs bg-primary px-3 py-1 rounded-full text-white border border-gray-600 transition-all duration-200 ease-in-out"
                    >
                        {tech}
                    </span>
                ))}
                {project.techStack.length > 3 && (
                    <span className="text-xs bg-primary px-3 py-1 rounded-full text-white border border-gray-600 transition-all duration-200 ease-in-out">
                        +{project.techStack.length - 3}
                    </span>
                )}
            </div>
        </div>
    </motion.div>
);
};

export default ProjectCard;
