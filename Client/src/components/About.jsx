import { motion } from 'framer-motion';
import { FaGraduationCap, FaEnvelope, FaAward } from 'react-icons/fa';
import image from '../assets/image.jpg';
import Education from './Education';


const About = () => {
    const stats = [
        { number: '3+', label: 'Years Experience', icon: FaAward },
        { number: '20+', label: 'Projects Completed', icon: FaAward },
        { number: '15+', label: 'Happy Clients', icon: FaAward },
    ];

    return (
        <section id="about" className="py-20 bg-gradient-to-b from-primary via-secondary/30 to-primary relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    {/* <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-white via-accent to-purple-400 bg-clip-text text-transparent">
                            About Me
                        </span>
                    </h2>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-accent to-purple-500 mx-auto rounded-full"></div>
                    <p className="text-gray-400 mt-4 text-lg">Get to know me better</p> */}

                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-white via-accent to-purple-400 bg-clip-text text-transparent">
                            About Me
                        </span>
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-accent to-purple-500 mx-auto rounded-full"></div>
                    <p className="text-gray-400 mt-4">Get to know me better.</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                    {/* Image Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="relative group"
                    >
                        {/* Glow effect */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-accent/30 to-purple-500/30 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* Image container */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-accent to-purple-500 rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
                            <img
                                src={image}
                                alt="Sayyad Azim"
                                className="relative rounded-2xl shadow-2xl border-4 border-accent/30 w-full transform -rotate-3 group-hover:-rotate-6 transition-transform duration-300"
                            />
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-xl"></div>
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
                    </motion.div>

                    {/* Content Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <p className="text-gray-300 text-lg leading-relaxed">
                            I am a passionate <span className="text-accent font-semibold">Full-Stack Developer</span> with a strong foundation in the MERN stack and a keen interest in Cloud Computing and Data Visualization. My journey in tech has been driven by a curiosity to understand how things work and a desire to build solutions that make a difference.
                        </p>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            With a B.Tech in Computer Science, I have honed my skills in building scalable web applications and analyzing complex datasets. My experience ranges from developing interactive frontend interfaces to architecting robust backend systems.
                        </p>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            I pride myself on my problem-solving abilities and my dedication to writing clean, maintainable code. Whether it's crafting a pixel-perfect UI or optimizing database queries, I approach every challenge with <span className="text-purple-400 font-semibold">enthusiasm and attention to detail</span>.
                        </p>

                        {/* Info cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                            <div className="group p-4 bg-gradient-to-br from-accent/10 to-purple-500/10 rounded-xl border border-accent/20 hover:border-accent/40 transition-all duration-300">
                                <div className="flex items-center gap-3">
                                    <FaGraduationCap className="text-2xl text-accent" />
                                    <div>
                                        <h4 className="text-accent font-bold">Education</h4>
                                        <p className="text-gray-300 text-sm">B.Tech in Computer Science</p>
                                    </div>
                                </div>
                            </div>

                            <div className="group p-4 bg-gradient-to-br from-accent/10 to-purple-500/10 rounded-xl border border-accent/20 hover:border-accent/40 transition-all duration-300">
                                <div className="flex items-center gap-3">
                                    <FaEnvelope className="text-2xl text-purple-400" />
                                    <div>
                                        <h4 className="text-purple-400 font-bold">Email</h4>
                                        <p className="text-gray-300 text-sm">azimsayyad90@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Education Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    viewport={{ once: true }}
                >
                    <Education />
                </motion.div>
            </div>
        </section>
    );
};

export default About;
