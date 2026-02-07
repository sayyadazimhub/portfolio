import { motion } from 'framer-motion';
import { FaGraduationCap, FaEnvelope, FaDownload } from 'react-icons/fa';
import image from '../../assets/image.jpeg';

const About = () => {
    return (
        <section id="about" className="py-20 bg-gradient-to-b from-secondary/30 to-primary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 pb-2 border-b-2 border-accent/30 inline-block">
                        About Me
                    </h2>
                    <p className="text-gray-400 mt-2">Get to know me better</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                    {/* Image Section - Styled with smaller size */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="flex justify-center lg:justify-start"
                    >
                        <div className="relative max-w-md w-full">
                            {/* Gradient border effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-accent to-purple-500 rounded-2xl blur opacity-25"></div>

                            <img
                                src={image}
                                alt="Sayyad Azim"
                                className="relative rounded-2xl shadow-xl w-full hover:shadow-2xl hover:shadow-accent/20 transition-all duration-300"
                            />
                        </div>
                    </motion.div>

                    {/* Content Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <p className="text-gray-300 leading-relaxed text-justify">
                            I am a passionate <span className="text-accent font-semibold">Full-Stack Developer</span> with a strong foundation in the MERN stack and a keen interest in Cloud Computing and Data Visualization. My journey in tech has been driven by a curiosity to understand how things work and a desire to build solutions that make a difference.
                        </p>
                        <p className="text-gray-300 leading-relaxed text-justify">
                            With a B.Tech in Computer Science, I have honed my skills in building scalable web applications and analyzing complex datasets. My experience ranges from developing interactive frontend interfaces to architecting robust backend systems.
                        </p>
                        <p className="text-gray-300 leading-relaxed text-justify">
                            I pride myself on my problem-solving abilities and my dedication to writing clean, maintainable code. Whether it's crafting a pixel-perfect UI or optimizing database queries, I approach every challenge with <span className="text-accent font-semibold">enthusiasm and attention to detail</span>.
                        </p>

                        {/* Info cards - Simplified */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                            <div className="p-4 bg-secondary/40 rounded-xl border border-gray-700/50 hover:border-accent/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <FaGraduationCap className="text-2xl text-accent" />
                                    <div>
                                        <h4 className="text-white font-semibold">Education</h4>
                                        <p className="text-gray-400 text-sm">B.Tech in Computer Science</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-secondary/40 rounded-xl border border-gray-700/50 hover:border-accent/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <FaEnvelope className="text-2xl text-accent" />
                                    <div>
                                        <h4 className="text-white font-semibold">Email</h4>
                                        <p className="text-gray-400 text-sm">azimsayyad90@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Download Resume Button */}
                        <div className="mt-8 flex justify-center lg:justify-start">
                            <a
                                href="/resume.pdf"
                                download="Sayyad_Azim_Resume.pdf"
                                className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-accent text-accent rounded-xl font-semibold transition-colors duration-300 hover:bg-accent hover:text-primary"
                            >
                                <span>Download Resume</span>
                                <FaDownload className="text-sm" />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
