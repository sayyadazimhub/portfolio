import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCode, FaRocket } from 'react-icons/fa';

const Hero = () => {
    return (
        <section id="hero" className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary via-primary to-secondary relative overflow-hidden">
            {/* Animated gradient orbs */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

            {/* Grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf620_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf620_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Greeting */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-full px-6 py-3 mb-8"
                    >
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                        </span>
                        <span className="text-accent font-semibold">Available for work</span>
                    </motion.div>

                    {/* Main heading with gradient */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-xl md:text-2xl font-semibold mb-4 text-gray-300"
                    >
                        Hello, I'm
                    </motion.h2>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
                    >
                        <span className="bg-gradient-to-r from-white via-accent to-purple-400 bg-clip-text text-transparent animate-gradient">
                            Sayyad Azim Rahim
                        </span>
                    </motion.h1>

                    {/* Subtitle with icons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="flex flex-wrap items-center justify-center gap-4 text-xl md:text-3xl text-gray-300 mb-8"
                    >
                        <span className="flex items-center gap-2">
                            <FaCode className="text-accent" />
                            Full-Stack Developer (MERN)
                        </span>
                        <span className="hidden md:inline text-accent">|</span>
                        <span className="flex items-center gap-2">
                            <FaRocket className="text-purple-400" />
                            Cloud & Power BI
                        </span>
                    </motion.div>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="text-gray-400 max-w-3xl mx-auto mb-12 text-lg md:text-xl leading-relaxed"
                    >
                        I build exceptional digital experiences that are fast, accessible, and visually stunning.
                        Passionate about cloud technologies and data visualization.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                        className="flex flex-col sm:flex-row justify-center gap-6"
                    >
                        <Link
                            to="/projects"
                            className="group relative inline-flex items-center justify-center gap-2 bg-accent text-primary px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-accent/50 hover:shadow-accent/70"
                        >
                            <span>View My Work</span>
                            <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>

                        <Link
                            to="/contact"
                            className="group relative inline-flex items-center justify-center gap-2 bg-transparent border-2 border-accent text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/10 transition-all duration-300"
                        >
                            <span className="bg-gradient-to-r from-white via-accent to-purple-400 bg-clip-text text-transparent group-hover:from-accent group-hover:to-white transition-all duration-300">
                                Get In Touch
                            </span>
                        </Link>
                    </motion.div>

                    {/* Scroll indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2"
                    >
                        <div className="w-6 h-10 border-2 border-accent/50 rounded-full flex justify-center p-2">
                            <motion.div
                                animate={{ y: [0, 12, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="w-1.5 h-1.5 bg-accent rounded-full"
                            ></motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
