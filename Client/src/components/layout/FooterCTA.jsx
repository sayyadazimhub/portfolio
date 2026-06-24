import { motion } from 'framer-motion';
import { FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const FooterCTA = () => {
    return (
        <section className="py-12 md:py-16 bg-slate-50 relative overflow-hidden flex flex-col justify-center">
            {/* Subtle Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-200 rounded-full blur-[120px] pointer-events-none opacity-40"></div>
            
            <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-4 md:gap-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center md:text-left flex-1 w-full">
                    <h2 
                        className="text-2xl sm:text-3xl md:text-4xl font-black text-black tracking-tight font-serif mb-3 leading-[1.1]"
                    >
                        Have a project in <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">mind?</span>
                    </h2>
                    <p 
                        className="text-slate-800 text-sm md:text-base font-medium leading-relaxed max-w-lg md:max-w-xl mx-auto md:mx-0"
                    >
                        I'm currently available for freelance work and full-time opportunities. Let's bring your ideas to life.
                    </p>
                </div>
                
                <div 
                    className="flex flex-col-reverse md:flex-row items-center gap-4 sm:gap-5 shrink-0 w-full md:w-auto mt-2 md:mt-0"
                >
                    <div className="flex items-center justify-center w-full sm:w-auto gap-3">
                        <a 
                            href="mailto:azimsayyad90@gmail.com"
                            className="text-slate-800 font-mono text-xs sm:text-sm font-semibold hover:text-indigo-600 transition-colors tracking-wide"
                        >
                            azimsayyad90@gmail.com
                        </a>
                        <span className="w-6 h-[2px] bg-slate-200 hidden md:block"></span>
                    </div>

                    <Link 
                        to="/contact"
                        className="w-full sm:w-auto group relative z-10 inline-flex items-center justify-center gap-2 sm:gap-3 font-mono text-[11px] sm:text-xs uppercase font-bold tracking-[0.15em] text-white border border-slate-900 rounded-lg overflow-hidden px-5 py-3 md:px-6 md:py-3.5 bg-black bg-[length:200%_auto] bg-[position:200%_center] bg-no-repeat transition-all duration-500 ease-in-out hover:border-blue-600 hover:bg-[position:40%_center] shadow-lg hover:shadow-indigo-500/25"
                        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 531.28 200'%3E%3Cdefs%3E%3Cstyle%3E .shape %7B fill: %232563eb %7D %3C/style%3E%3C/defs%3E%3Cg id='Layer_2' data-name='Layer 2'%3E%3Cg id='Layer_1-2' data-name='Layer 1'%3E%3Cpolygon class='shape' points='415.81 200 0 200 115.47 0 531.28 0 415.81 200' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
                    >
                        <span className="relative z-10">Say Hello</span>
                        <FaEnvelope className="relative z-10 w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-300" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FooterCTA;
