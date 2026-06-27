import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

import logo from '../../assets/logo.png';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Projects', path: '/projects' },
        { name: 'Contact', path: '/contact' },
    ];

    const isActive = (path) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname.startsWith(path);
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => { setIsOpen(false); }, [location.pathname]);

    return (
        <header
            ref={navRef}
            className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md border-b border-slate-200' : 'border-b border-slate-100'
                }`}
        >
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main row */}
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 shrink-0 group">
                        <div className="relative w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 group-hover:border-indigo-300 group-hover:bg-indigo-50 transition-all duration-300">
                            <img
                                src={logo}
                                alt="Sayyad Portfolio"
                                className="h-8 w-8 object-contain transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                            />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="font-serif font-black text-black text-base md:text-lg tracking-tight group-hover:text-indigo-600 transition-colors duration-300">
                                Sayyad Azim
                            </span>
                            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 mt-0.5">
                                Portfolio
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center h-full">
                        {navLinks.map((link) => {
                            const active = isActive(link.path);
                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`relative group flex items-center px-6 h-full transition-colors duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${active ? 'bg-slate-50' : 'hover:bg-slate-50/60'
                                        }`}
                                >
                                    <span className="relative flex flex-col items-start gap-[5px]">
                                        <span className={`font-mono text-sm uppercase tracking-[0.18em] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${active
                                            ? 'text-black font-bold'
                                            : 'text-slate-400 font-medium group-hover:text-slate-800'
                                            }`}>
                                            {link.name}
                                        </span>
                                        {/* Bottom line — expands from left */}
                                        <span
                                            className={`block h-[2px] rounded-full will-change-[width] transition-[width,background-color] duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${active
                                                ? 'w-full bg-indigo-600'
                                                : 'w-0 bg-slate-300 group-hover:w-full'
                                                }`}
                                        />
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right CTA */}
                    <div className="hidden md:flex items-center">
                        <div className="relative w-fit h-fit ml-2 before:content-[''] before:absolute before:w-[calc(100%+0.5em)] before:h-[50%] before:-left-[0.3em] before:-top-[0.3em] before:border before:border-b-0 before:border-black after:content-[''] after:absolute after:w-[calc(100%+0.5em)] after:h-[50%] after:-left-[0.3em] after:-bottom-[0.3em] after:border after:border-t-0 after:border-black after:z-0">
                            <Link
                                to="/resume"
                                className={`relative z-10 inline-flex items-center justify-center font-mono text-[13px] uppercase font-bold tracking-[0.15em] text-white border rounded px-6 py-2.5 bg-black bg-[length:200%_auto] bg-no-repeat transition-all duration-500 ease-in-out before:content-[''] before:absolute before:w-[0.2rem] before:h-[0.2rem] before:-top-[1px] before:-left-[1px] before:transition-colors before:duration-500 hover:before:bg-white after:content-[''] after:absolute after:bg-blue-600 after:w-[0.3rem] after:h-[0.3rem] after:-bottom-[1px] after:-right-[1px] after:transition-colors after:duration-500 hover:after:bg-white ${isActive('/resume')
                                        ? 'border-blue-600 bg-[position:40%_center] before:bg-white'
                                        : 'border-black bg-[position:200%_center] hover:border-blue-600 hover:bg-[position:40%_center] before:bg-black'
                                    }`}
                                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 531.28 200'%3E%3Cdefs%3E%3Cstyle%3E .shape %7B fill: %232563eb %7D %3C/style%3E%3C/defs%3E%3Cg id='Layer_2' data-name='Layer 2'%3E%3Cg id='Layer_1-2' data-name='Layer 1'%3E%3Cpolygon class='shape' points='415.81 200 0 200 115.47 0 531.28 0 415.81 200' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
                            >
                                View Resume
                            </Link>
                        </div>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                        className="flex md:hidden items-center justify-center w-10 h-10 border-[1.5px] border-slate-300 text-slate-600 hover:text-black hover:border-slate-400 bg-white transition-colors duration-150 relative overflow-hidden"
                    >
                        <span className={`absolute transform transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'}`}>
                            <FaBars size={14} />
                        </span>
                        <span className={`absolute transform transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-50'}`}>
                            <FaTimes size={14} />
                        </span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="absolute top-full left-0 w-full overflow-hidden bg-white md:hidden border-t border-slate-200 shadow-xl"
                    >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-col">
                        {navLinks.map((link) => {
                            const active = isActive(link.path);
                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`group flex items-center justify-between px-2 py-4 border-b border-slate-100 transition-colors duration-200 ${active ? 'bg-slate-50' : 'hover:bg-slate-50/60'
                                        }`}
                                >
                                    <span className="relative flex flex-col items-start gap-[5px]">
                                        <span className={`font-mono text-xs uppercase tracking-[0.18em] transition-colors duration-200 ${active ? 'text-black font-bold' : 'text-slate-400 font-medium'
                                            }`}>
                                            {link.name}
                                        </span>
                                        <span className={`block h-[2px] rounded-full transition-[width] duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${active ? 'w-full bg-indigo-600' : 'w-0'
                                            }`} />
                                    </span>
                                    {active && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                                    )}
                                </Link>
                            );
                        })}
                        <div className="py-4">
                            <div className="relative w-full h-fit mt-2 mb-2 px-2">
                                <div className="relative w-full h-fit before:content-[''] before:absolute before:w-[calc(100%+0.5em)] before:h-[50%] before:-left-[0.3em] before:-top-[0.3em] before:border before:border-b-0 before:border-black after:content-[''] after:absolute after:w-[calc(100%+0.5em)] after:h-[50%] after:-left-[0.3em] after:-bottom-[0.3em] after:border after:border-t-0 after:border-black after:z-0">
                                    <Link
                                        to="/resume"
                                        onClick={() => setIsOpen(false)}
                                        className={`relative z-10 w-full flex items-center justify-center font-mono text-[13px] uppercase font-bold tracking-[0.15em] text-white border rounded px-6 py-3 bg-black bg-[length:200%_auto] bg-no-repeat transition-all duration-500 ease-in-out before:content-[''] before:absolute before:w-[0.2rem] before:h-[0.2rem] before:-top-[1px] before:-left-[1px] before:transition-colors before:duration-500 hover:before:bg-white after:content-[''] after:absolute after:bg-blue-600 after:w-[0.3rem] after:h-[0.3rem] after:-bottom-[1px] after:-right-[1px] after:transition-colors after:duration-500 hover:after:bg-white ${isActive('/resume')
                                                ? 'border-blue-600 bg-[position:40%_center] before:bg-white'
                                                : 'border-black bg-[position:200%_center] hover:border-blue-600 hover:bg-[position:40%_center] before:bg-black'
                                            }`}
                                        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 531.28 200'%3E%3Cdefs%3E%3Cstyle%3E .shape %7B fill: %232563eb %7D %3C/style%3E%3C/defs%3E%3Cg id='Layer_2' data-name='Layer 2'%3E%3Cg id='Layer_1-2' data-name='Layer 1'%3E%3Cpolygon class='shape' points='415.81 200 0 200 115.47 0 531.28 0 415.81 200' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
                                    >
                                        View Resume
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
        </header>
    );
};

export default Navbar;
