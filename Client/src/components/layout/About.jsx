import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaEnvelope, FaRocket, FaCode, FaBriefcase, FaGraduationCap } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import imageFallback from '../../assets/image.jpeg';
import { apiService } from '../../utils/api';

const About = () => {
    const [aboutData, setAboutData] = useState(null);
    const [resumeUrl, setResumeUrl] = useState('');
    const [stats, setStats] = useState({
        projects: 0,
        certificates: 0,
        experiences: 0,
        yearsExperience: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [aboutRes, projectsRes, certificatesRes, experienceRes, resumeRes] = await Promise.all([
                    apiService.getAboutMe(),
                    apiService.getProjects(),
                    apiService.getCertificates(),
                    apiService.getExperience(),
                    apiService.getResume()
                ]);
                
                const data = Array.isArray(aboutRes.data) ? aboutRes.data[0] : aboutRes.data;
                setAboutData(data);

                const projects = Array.isArray(projectsRes.data) ? projectsRes.data : (projectsRes.data?.data || []);
                const completedProjects = projects.filter(project => project.status === 'Completed');
                const certificates = Array.isArray(certificatesRes.data) ? certificatesRes.data : (certificatesRes.data?.data || []);
                const experiences = Array.isArray(experienceRes.data) ? experienceRes.data : (experienceRes.data?.data || []);
                
                const resumeData = Array.isArray(resumeRes.data) ? resumeRes.data[0] : (resumeRes.data?.data?.[0] || resumeRes.data);
                if (resumeData && resumeData.resumeUrl) {
                    setResumeUrl(resumeData.resumeUrl);
                }
                
                // Calculate total years of experience based on earliest start date
                let yearsExperience = 0;
                if (experiences && experiences.length > 0) {
                    const validDates = experiences
                        .map(exp => new Date(exp.startDate))
                        .filter(date => !isNaN(date.getTime()));
                        
                    if (validDates.length > 0) {
                        const earliestDate = new Date(Math.min(...validDates));
                        const now = new Date();
                        // Calculate exact years difference
                        const diffTime = Math.abs(now - earliestDate);
                        const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
                        yearsExperience = Math.floor(diffYears);
                    }
                }
                
                setStats({
                    projects: completedProjects.length,
                    certificates: certificates.length,
                    experiences: experiences.length,
                    yearsExperience: yearsExperience
                });
            } catch (error) {
                console.error('Error fetching about data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const profileImage = aboutData?.profileImage || imageFallback;
    const fullName = aboutData?.fullName || 'Sayyad Azim';
    const title = aboutData?.title || 'Full-Stack Developer';
    const bioText = aboutData?.bio || "I am a passionate Full-Stack Developer with a strong foundation in the MERN stack and a keen interest in Cloud Computing and Data Visualization.\nMy journey in tech has been driven by a curiosity to understand how things work and a desire to build solutions that make a difference.";

    return (
        <section id="about" className="pt-10 pb-12 md:pt-14 md:pb-14 bg-white relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-100/40 via-transparent to-transparent pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {loading ? (
                    <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-12 lg:gap-16">
                        {/* Image Skeleton */}
                        <div className="w-full lg:w-4/12 flex items-center justify-center animate-pulse">
                            <div className="w-full max-w-xs sm:max-w-sm aspect-[4/5] rounded-[2.5rem] bg-slate-200 border border-slate-100"></div>
                        </div>

                        {/* Content Skeleton */}
                        <div className="w-full lg:w-8/12 flex flex-col justify-center animate-pulse">
                            <div className="w-32 h-4 bg-slate-300 rounded-md mb-4"></div>
                            <div className="w-3/4 h-12 sm:h-14 bg-slate-200 rounded-xl mb-6"></div>
                            
                            <div className="space-y-3 mb-8">
                                <div className="w-full h-4 bg-slate-200 rounded-md"></div>
                                <div className="w-full h-4 bg-slate-200 rounded-md"></div>
                                <div className="w-5/6 h-4 bg-slate-200 rounded-md"></div>
                            </div>

                            <div className="flex flex-wrap items-stretch justify-center md:justify-between gap-3 sm:gap-4 mb-8">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="flex-1 basis-[calc(50%-0.5rem)] md:basis-0 min-w-[130px] sm:min-w-[180px] bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-sm flex items-center gap-3 sm:gap-4">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-200 rounded-xl shrink-0"></div>
                                        <div className="flex flex-col gap-2 w-full justify-center">
                                            <div className="w-12 h-6 bg-slate-300 rounded-md"></div>
                                            <div className="w-20 h-2 bg-slate-200 rounded-sm"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2">
                                <div className="w-full sm:w-48 h-12 bg-slate-100 rounded-xl"></div>
                                <div className="w-full sm:w-40 h-12 bg-slate-50 rounded-xl border border-slate-100"></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-12 lg:gap-16">

                        {/* Image Side */}
                        <motion.div
                            className="w-full lg:w-4/12 flex items-center justify-center group"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <div className="relative z-10 w-full max-w-xs sm:max-w-sm aspect-[4/5]">
                                {/* Animated Backdrops */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-[2.5rem] rotate-3 opacity-20 scale-105 group-hover:rotate-6 group-hover:scale-[1.08] transition-all duration-700 ease-out"></div>
                                <div className="absolute inset-0 border-2 border-indigo-200/50 rounded-[2.5rem] -rotate-3 scale-105 group-hover:-rotate-6 transition-all duration-700 ease-out"></div>

                                {/* Main Image Container */}
                                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-xl shadow-indigo-900/10 bg-slate-100 ring-4 ring-white">
                                    <img
                                        src={profileImage}
                                        alt={fullName}
                                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-1000 ease-out"
                                    />
                                    {/* Hover Details overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/0 to-transparent flex flex-col justify-end p-6">
                                        {/* <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500"> */}
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            whileInView={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            <h4 className="text-2xl font-black text-white font-serif">{fullName}</h4>
                                            <p className="text-cyan-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs mt-2 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                                                {title}
                                            </p>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Content Side */}
                        <motion.div
                            className="w-full lg:w-8/12 flex flex-col justify-center"
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                        >
                            <h2 className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] mb-2 sm:mb-3 text-indigo-600 font-bold flex items-center gap-2">
                                Discover More
                            </h2>
                            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black mb-5 font-serif leading-[1.1] tracking-tight">
                                Crafting digital experiences with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">precision.</span>
                            </h3>

                            <div className="text-slate-600 leading-relaxed space-y-3 text-sm sm:text-base text-justify mb-8">
                                {bioText.split('\n').map((paragraph, index) => (
                                    <p key={index} className={index === 0 ? "font-medium text-slate-800 text-base sm:text-lg leading-relaxed" : ""}>
                                        {paragraph}
                                    </p>
                                ))}
                            </div>

                            {/* Compact Stats Flex Container */}
                            <div className="flex flex-wrap items-stretch justify-center md:justify-between gap-3 sm:gap-4 mb-8">
                                {/* Projects Card */}
                                <div className="flex-1 basis-[calc(50%-0.5rem)] md:basis-0 min-w-[130px] sm:min-w-[180px] bg-white rounded-2xl p-3 sm:p-4 shadow-sm shadow-slate-100/50 border border-slate-200 hover:shadow-lg hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300 group flex items-center gap-3 sm:gap-4">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 group-hover:scale-110 group-hover:bg-indigo-100 transition-all duration-300 shrink-0">
                                        <FaRocket className="text-base sm:text-lg" />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h4 className="text-xl sm:text-2xl font-black text-slate-900 leading-none mb-1">{stats.projects > 0 ? stats.projects : 10}<span className="text-indigo-500">+</span></h4>
                                        <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-600 leading-none">Production Builds</p>
                                    </div>
                                </div>

                                {/* Stack Card */}
                                <div className="flex-1 basis-[calc(50%-0.5rem)] md:basis-0 min-w-[130px] sm:min-w-[180px] bg-white rounded-2xl p-3 sm:p-4 shadow-sm shadow-slate-100/50 border border-slate-200 hover:shadow-lg hover:border-cyan-100 hover:-translate-y-1 transition-all duration-300 group flex items-center gap-3 sm:gap-4">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-500 group-hover:scale-110 group-hover:bg-cyan-100 transition-all duration-300 shrink-0">
                                        <FaCode className="text-base sm:text-lg" />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h4 className="text-xl sm:text-2xl font-black text-slate-900 leading-none mb-1">{stats.certificates > 0 ? stats.certificates : 2}<span className="text-cyan-500">+</span></h4>
                                        <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-600 leading-none">Verified Credentials</p>
                                    </div>
                                </div>

                                {/* Corporate Role Card */}
                                <div className="flex-1 basis-[calc(50%-0.5rem)] md:basis-0 min-w-[130px] sm:min-w-[180px] bg-white rounded-2xl p-3 sm:p-4 shadow-sm shadow-slate-100/50 border border-slate-200 hover:shadow-lg hover:border-amber-100 hover:-translate-y-1 transition-all duration-300 group flex items-center gap-3 sm:gap-4">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 group-hover:scale-110 group-hover:bg-amber-100 transition-all duration-300 shrink-0">
                                        <FaBriefcase className="text-base sm:text-lg" />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h4 className="text-xl sm:text-2xl font-black text-slate-900 leading-none mb-1">{stats.experiences > 0 ? stats.experiences : 2}<span className="text-amber-500">+</span></h4>
                                        <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-600 leading-none">Corporate Roles</p>
                                    </div>
                                </div>

                                {/* Experience Card */}
                                <div className="flex-1 basis-[calc(50%-0.5rem)] md:basis-0 min-w-[130px] sm:min-w-[180px] bg-white rounded-2xl p-3 sm:p-4 shadow-sm shadow-slate-100/50 border border-slate-200 hover:shadow-lg hover:border-rose-100 hover:-translate-y-1 transition-all duration-300 group flex items-center gap-3 sm:gap-4">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 group-hover:scale-110 group-hover:bg-rose-100 transition-all duration-300 shrink-0">
                                        <FaGraduationCap className="text-base sm:text-lg" />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h4 className="text-xl sm:text-2xl font-black text-slate-900 leading-none mb-1">{stats.yearsExperience > 0 ? stats.yearsExperience : 1}<span className="text-rose-500">+</span></h4>
                                        <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-600 leading-none">Yrs Exp</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                                <a
                                    href={resumeUrl || "/resume.pdf"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download={`${fullName.replace(/\s+/g, '_')}_Resume.pdf`}
                                    className="w-full sm:w-auto group relative z-10 inline-flex items-center justify-center gap-2 sm:gap-3 font-mono text-[11px] sm:text-xs uppercase font-bold tracking-[0.15em] text-white border border-black rounded-lg overflow-hidden px-5 py-3.5 md:px-6 md:py-4 bg-black bg-[length:200%_auto] bg-[position:200%_center] bg-no-repeat transition-all duration-500 ease-in-out hover:border-blue-600 hover:bg-[position:40%_center] shadow-lg hover:shadow-indigo-500/25"
                                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 531.28 200'%3E%3Cdefs%3E%3Cstyle%3E .shape %7B fill: %232563eb %7D %3C/style%3E%3C/defs%3E%3Cg id='Layer_2' data-name='Layer 2'%3E%3Cg id='Layer_1-2' data-name='Layer 1'%3E%3Cpolygon class='shape' points='415.81 200 0 200 115.47 0 531.28 0 415.81 200' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
                                >
                                    <span className="relative z-10">Download Resume</span>
                                    <FaDownload className="relative z-10 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300" />
                                </a>
                                <Link
                                    to="/contact"
                                    className="group w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-white text-black border-2 border-black px-5 py-3.5 md:px-6 md:py-4 rounded-lg font-mono text-[10px] sm:text-xs uppercase tracking-[0.15em] font-bold hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all duration-300"
                                >
                                    <span>Contact Me</span>
                                    <FaEnvelope className="text-black group-hover:text-indigo-600 transition-colors duration-300" />
                                </Link>
                            </div>

                        </motion.div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default About;
