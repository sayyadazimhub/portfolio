import { FaGithub, FaLinkedin, FaEnvelope, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    const socialLinks = [
        { icon: FaGithub, href: 'https://github.com/sayyadazimhub', label: 'GitHub' },
        { icon: FaLinkedin, href: 'https://www.linkedin.com/in/sayyadazimmern/', label: 'LinkedIn' },
        { icon: FaEnvelope, href: 'mailto:azimsayyad90@gmail.com', label: 'Email' },
    ];

    const quickLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Projects', path: '/projects' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <footer className="relative bg-gradient-to-b from-secondary/50 to-primary border-t border-accent/20 mt-auto overflow-hidden">
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-purple-500/5 to-accent/5"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* About Section */}
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-white via-accent to-purple-400 bg-clip-text text-transparent mb-3">
                            Portfolio
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Building amazing web experiences with modern technologies and creative solutions.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
                        <div className="flex flex-wrap justify-center gap-4">
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="text-gray-400 hover:text-accent transition-colors duration-300 text-sm font-medium"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="text-center md:text-right">
                        <h3 className="text-lg font-semibold text-white mb-3">Connect With Me</h3>
                        <div className="flex justify-center md:justify-end space-x-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative"
                                    aria-label={social.label}
                                >
                                    {/* Glow effect */}
                                    <div className="absolute inset-0 bg-accent/30 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    {/* Icon container */}
                                    <div className="relative p-3 bg-gradient-to-br from-accent/10 to-purple-500/10 rounded-lg border border-accent/30 group-hover:border-accent/60 transition-all duration-300 group-hover:scale-110">
                                        <social.icon className="text-xl text-gray-400 group-hover:text-accent transition-colors duration-300" />
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Divider with gradient */}
                <div className="relative h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent mb-8"></div>

                {/* Copyright */}
                <div className="text-center">
                    <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
                        <span>&copy; {new Date().getFullYear()} Sayyad Azim. Made with</span>
                        <FaHeart className="text-accent animate-pulse" />
                        <span>All rights reserved.</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
