import { motion } from 'framer-motion';
import { FaReact, FaNodeJs, FaDatabase, FaAws, FaDocker, FaPython, FaFigma, FaGithub, FaHtml5, FaCss3Alt, FaJs } from 'react-icons/fa';

const SKILLS = [
    { name: 'React', icon: FaReact, color: 'text-cyan-400' },
    { name: 'Node.js', icon: FaNodeJs, color: 'text-green-400' },
    { name: 'JavaScript', icon: FaJs, color: 'text-yellow-400' },
    { name: 'HTML5', icon: FaHtml5, color: 'text-orange-400' },
    { name: 'CSS3', icon: FaCss3Alt, color: 'text-blue-400' },
    { name: 'Database', icon: FaDatabase, color: 'text-emerald-400' },
    { name: 'AWS', icon: FaAws, color: 'text-amber-400' },
    { name: 'Docker', icon: FaDocker, color: 'text-blue-500' },
    { name: 'Python', icon: FaPython, color: 'text-yellow-300' },
    { name: 'Figma', icon: FaFigma, color: 'text-pink-400' },
    { name: 'GitHub', icon: FaGithub, color: 'text-white' },
];

// Triple the array to ensure seamless infinite looping even on ultra-wide screens
const LOOPED_SKILLS = [...SKILLS, ...SKILLS, ...SKILLS]; 

const MinimalSkillsCTA = () => {
    return (
        <section className="py-8 md:py-10 bg-slate-900 text-white overflow-hidden relative">
            {/* Minimalist Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

            {/* Ultra-compact CTA Strip */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 mb-6 md:mb-8">
                <div className="text-center md:text-left">
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-black tracking-tight font-serif mb-1">
                        Ready to build something <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">extraordinary?</span>
                    </h2>
                    <p className="text-slate-400 text-xs md:text-sm font-medium tracking-wide">Let's bring your vision to life.</p>
                </div>
                <button className="group relative inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-6 py-2.5 rounded-full font-mono text-[10px] sm:text-xs uppercase tracking-[0.1em] font-bold shadow-[0_0_15px_rgba(99,102,241,0.15)] hover:shadow-[0_0_25px_rgba(99,102,241,0.3)] hover:scale-105 transition-all duration-300 shrink-0">
                    <span>Let's Work Together</span>
                    <svg className="w-3.5 h-3.5 text-indigo-600 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </div>

            {/* Micro Infinite Loop Marquee */}
            <div className="relative w-full flex overflow-hidden py-4 md:py-5 border-y border-white/5 bg-white/[0.01] backdrop-blur-sm">
                {/* Fade Gradients */}
                <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none"></div>
                
                <motion.div 
                    className="flex whitespace-nowrap gap-8 md:gap-12 items-center w-max"
                    animate={{ x: ["0%", "-33.333333%"] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 35
                    }}
                >
                    {LOOPED_SKILLS.map((skill, index) => {
                        const Icon = skill.icon;
                        return (
                            <div key={index} className="flex items-center gap-2.5 group cursor-default">
                                <Icon className={`w-4 h-4 md:w-5 md:h-5 opacity-40 group-hover:opacity-100 transition-opacity duration-300 ${skill.color}`} />
                                <span className="text-xs md:text-sm font-bold font-mono tracking-widest opacity-20 group-hover:opacity-100 transition-opacity duration-300 uppercase">
                                    {skill.name}
                                </span>
                            </div>
                        )
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default MinimalSkillsCTA;
