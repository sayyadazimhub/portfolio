import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

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

    return (
        <nav className="fixed w-full z-50 bg-gradient-to-r from-primary/95 via-primary/90 to-primary/95 backdrop-blur-xl border-b border-accent/20 shadow-lg shadow-accent/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center gap-3 group relative">
                            {/* Glow effect behind logo */}
                            {/* <div className="absolute -inset-2 bg-gradient-to-r from-accent/30 via-purple-500/30 to-accent/30 rounded-xl opacity-0 group-hover:opacity-100 blur-lg transition-all duration-500"></div> */}

                            {/* Logo container with gradient border */}
                            <div className="relative p-2 bg-gradient-to-br from-accent/10 to-purple-500/10 rounded-xl border border-accent/30 group-hover:border-accent/60 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                <img
                                    src={logo}
                                    alt="Logo"
                                    className="h-10 w-10 object-contain drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]"
                                />
                            </div>

                            <div className="relative">
                                <span className="text-2xl font-bold bg-gradient-to-r from-white via-accent to-purple-400 bg-clip-text text-transparent group-hover:from-accent group-hover:via-purple-400 group-hover:to-white transition-all duration-500">
                                    Portfolio
                                </span>
                                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-accent to-purple-500 group-hover:w-full transition-all duration-500"></div>
                            </div>
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 group ${isActive(link.path)
                                        ? 'text-accent'
                                        : 'text-gray-300 hover:text-white'
                                        }`}
                                >
                                    <span className="relative z-10">{link.name}</span>

                                    {/* Animated underline */}
                                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-accent to-purple-500 transition-all duration-300 ${isActive(link.path)
                                        ? 'w-3/4'
                                        : 'w-0 group-hover:w-3/4'
                                        }`}></span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="relative inline-flex items-center justify-center p-3 rounded-lg text-gray-400 hover:text-white hover:bg-accent/10 focus:outline-none border border-transparent hover:border-accent/30 transition-all duration-300"
                        >
                            <span className="absolute inset-0 bg-gradient-to-br from-accent/5 to-purple-500/5 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                            {isOpen ? <FaTimes size={24} className="relative z-10" /> : <FaBars size={24} className="relative z-10" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden bg-gradient-to-b from-primary/95 to-primary/90 backdrop-blur-xl border-b border-accent/20"
                >
                    <div className="px-4 pt-2 pb-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`relative block px-4 py-3 rounded-lg text-base font-semibold transition-all duration-300 ${isActive(link.path)
                                    ? 'text-accent bg-accent/10 border border-accent/30'
                                    : 'text-gray-300 hover:text-white hover:bg-accent/5 border border-transparent hover:border-accent/20'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </motion.div>
            )}
        </nav>
    );
};

export default Navbar;
