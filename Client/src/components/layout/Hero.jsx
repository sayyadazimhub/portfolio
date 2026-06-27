import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaReact, FaNodeJs, FaDatabase, FaAws, FaGithub, FaLinkedin, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import { apiService } from '../../utils/api';
import logo from '../../assets/logo.png';

const Hero = () => {
    const [aboutData, setAboutData] = useState(null);

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const res = await apiService.getAbout();
                // Check if data is array or object and get the first item if array
                const data = Array.isArray(res.data) ? res.data[0] : (res.data?.data?.[0] || res.data?.data || res.data);
                setAboutData(data);
            } catch (err) {
                console.error("Failed to load hero data", err);
            }
        };

        fetchAbout();
    }, []);

    // Floating animation for the icons
    const floatingAnimation = (delay) => ({
        y: ['-10%', '10%'],
        rotate: [-2, 2],
        transition: {
            duration: 4,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: delay,
        },
    });

    // Staggered text reveal variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }
        }
    };

    return (
        <section id="hero" className="flex items-center justify-center bg-white relative overflow-hidden text-black pt-10 pb-10">
            {/* Subtle Grid Mask */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full relative">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

                    {/* Left Column: Text Content */}
                    <div
                        className="flex flex-col items-center text-center lg:items-start lg:text-left lg:w-1/2 w-full"
                    >
                        {/* Status Pill */}
                        <div
                            className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-md border border-slate-200/50 shadow-sm rounded-full px-4 py-2 mb-6 sm:mb-8 hover:bg-white hover:shadow-md transition-all duration-300 cursor-default"
                        >
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                            </span>
                            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-800 font-bold">Available for Work</span>
                        </div>

                        {/* Subtitle */}
                        <h2
                            className="font-mono text-xs sm:text-sm uppercase tracking-[0.2em] mb-4 text-indigo-600 font-bold flex items-center gap-3"
                        >
                            <span className="hidden lg:block w-8 h-0.5 bg-indigo-600"></span>
                            Hello, I'm
                        </h2>

                        {/* Main Heading */}
                        <h1
                            className="font-serif text-5xl sm:text-7xl lg:text-[5.5rem] font-black mb-6 leading-[1.05] tracking-tight text-black"
                        >
                            Sayyad <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 relative inline-block">
                                Azim
                                {/* Underline highlight */}
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-cyan-400/30" viewBox="0 0 100 20" preserveAspectRatio="none">
                                    <path d="M0,10 Q50,20 100,10" fill="currentColor" />
                                </svg>
                            </span>
                        </h1>

                        {/* Skill/Role Banner */}
                        <div
                            className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8 font-mono text-[10px] sm:text-xs uppercase tracking-[0.15em] text-slate-800 font-bold"
                        >
                            <span className="bg-slate-100 px-3 py-1 rounded-md">Full-Stack Dev</span>
                            <span className="text-indigo-400 font-black">+</span>
                            <span className="bg-slate-100 px-3 py-1 rounded-md">Cloud Solutions</span>
                            <span className="text-indigo-400 font-black">+</span>
                            <span className="bg-slate-100 px-3 py-1 rounded-md">Power BI</span>
                        </div>

                        {/* Description */}
                        <p
                            className="text-slate-800 font-medium max-w-xl mb-10 text-base sm:text-lg leading-relaxed"
                        >
                            I engineer robust, highly scalable digital solutions focusing on modern architectures, cloud infrastructure, and seamless user experiences. Let's build something extraordinary.
                        </p>

                        {/* CTA Buttons & Social Links */}
                        <div
                            className="flex flex-wrap justify-center lg:justify-start items-center gap-4 w-full"
                        >
                            <Link
                                to="/projects"
                                className="w-full sm:w-auto group relative z-10 inline-flex items-center justify-center gap-2 sm:gap-3 font-mono text-[11px] sm:text-xs uppercase font-bold tracking-[0.15em] text-white border border-black rounded-lg overflow-hidden px-5 py-3.5 md:px-6 md:py-4 bg-black bg-[length:200%_auto] bg-[position:200%_center] bg-no-repeat transition-all duration-500 ease-in-out hover:border-blue-600 hover:bg-[position:40%_center] shadow-lg hover:shadow-indigo-500/25"
                                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 531.28 200'%3E%3Cdefs%3E%3Cstyle%3E .shape %7B fill: %232563eb %7D %3C/style%3E%3C/defs%3E%3Cg id='Layer_2' data-name='Layer 2'%3E%3Cg id='Layer_1-2' data-name='Layer 1'%3E%3Cpolygon class='shape' points='415.81 200 0 200 115.47 0 531.28 0 415.81 200' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
                            >
                                <span className="relative z-10">Explore My Work</span>
                                <FaArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                            </Link>

                            <Link
                                to="/contact"
                                className="group inline-flex items-center justify-center gap-2 px-5 py-3.5 md:px-6 md:py-4 bg-white text-black border-2 border-black rounded-lg font-mono text-[11px] sm:text-xs uppercase tracking-[0.15em] font-bold hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 w-full sm:w-auto"
                            >
                                <span>Let's Talk</span>
                            </Link>


                        </div>
                    </div>

                    {/* Right Column: Profile Composition */}
                    <div
                        className="hidden lg:flex lg:w-1/2 justify-center lg:justify-end relative h-[500px] items-center"
                    >
                        <div className="relative w-[400px] h-[400px] xl:w-[480px] xl:h-[480px] flex items-center justify-center">

                            {/* Animated Outer Rings */}
                            <div
                                className="absolute inset-0 rounded-full border-[1.5px] border-dashed border-indigo-300/40"
                            ></div>

                            <div
                                className="absolute inset-6 rounded-full border border-cyan-400/30"
                            ></div>

                            <div
                                className="absolute inset-12 rounded-full border border-indigo-200/20"
                            ></div>

                            {/* Core Image Container */}
                            <a
                                href="https://github.com/sayyadazimhub"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative w-[65%] h-[65%] rounded-full overflow-hidden shadow-2xl shadow-indigo-900/20 ring-[12px] ring-white z-10 flex items-center justify-center p-0 cursor-pointer group block"
                            >
                                <img
                                    src="https://github.com/sayyadazimhub.png"
                                    alt="Sayyad Azim GitHub"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent mix-blend-overlay pointer-events-none"></div>
                            </a>

                            {/* Elegant Floating Badges */}
                            <motion.a
                                href="https://github.com/sayyadazimhub"
                                target="_blank"
                                rel="noopener noreferrer"
                                animate={floatingAnimation(1)}
                                className="absolute bottom-[16%] -left-[3%] z-20 bg-white px-4 py-3 rounded-2xl shadow-xl shadow-sky-900/10 border border-slate-100 flex items-center gap-3 cursor-pointer hover:scale-105 hover:shadow-sky-500/20 transition-all duration-300 transform-gpu antialiased"
                            >
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                    <FaGithub className="text-xl text-slate-800" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-bold leading-none">Open Source</span>
                                    <span className="font-sans text-sm font-bold text-slate-800">GitHub</span>
                                </div>
                            </motion.a>

                            <motion.a
                                href="https://linkedin.com/in/sayyadazim"
                                target="_blank"
                                rel="noopener noreferrer"
                                animate={floatingAnimation(0.5)}
                                className="absolute bottom-[30%] -right-[10%] z-20 bg-white px-4 py-3 rounded-2xl shadow-xl shadow-blue-900/10 border border-slate-100 flex items-center gap-3 cursor-pointer hover:scale-105 hover:shadow-blue-500/20 transition-all duration-300 transform-gpu antialiased"
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                    <FaLinkedin className="text-xl text-blue-600" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-bold leading-none">Connect</span>
                                    <span className="font-sans text-sm font-bold text-slate-800">LinkedIn</span>
                                </div>
                            </motion.a>

                            {/* Experience Badge */}
                            <motion.div
                                animate={floatingAnimation(1.5)}
                                className="absolute top-[2%] left-[20%] z-10 w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full shadow-lg shadow-indigo-600/30 flex items-center justify-center border-4 border-white cursor-default hover:scale-105 transition-transform duration-300"
                            >
                                <div className="text-center text-white">
                                    <div className="font-black text-2xl leading-none">2+</div>
                                    <div className="font-mono text-[8px] uppercase tracking-widest mt-1 opacity-80">Years<br />Exp</div>
                                </div>
                            </motion.div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Hero;
