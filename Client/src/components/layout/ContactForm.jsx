import { useState } from 'react';
import { motion } from 'framer-motion';
import { apiService } from '../../utils/api';
import { FaPaperPlane, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaCode } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error('Please enter your name');
            return;
        }
        if (!formData.email.trim()) {
            toast.error('Please enter your email');
            return;
        }
        if (!formData.subject.trim()) {
            toast.error('Please enter a subject');
            return;
        }
        if (!formData.message.trim()) {
            toast.error('Please enter a message');
            return;
        }

        setLoading(true);

        try {
            await apiService.sendContact(formData);
            toast.success('Message sent successfully!');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            const backendErrors = error.response?.data?.errors;
            if (Array.isArray(backendErrors) && backendErrors.length > 0) {
                backendErrors.forEach((err) => toast.error(err));
            } else {
                const errMsg = error.response?.data?.message || 'Failed to send message. Please try again.';
                toast.error(errMsg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="contact" className="w-full bg-slate-50 pt-10 pb-12 relative overflow-hidden">

            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-indigo-100/40 via-cyan-50/20 to-transparent rounded-full blur-3xl -z-10 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 lg:items-stretch">

                    {/* Left Column: Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left"
                    >
                        <div>
                            <div className="inline-flex items-center gap-3 mb-3 md:mb-4 px-4 py-2 bg-white rounded-full border border-slate-100 shadow-sm">
                                <span className="w-2 h-2 rounded-full animate-pulse bg-indigo-600"></span>
                                <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-800 font-bold">
                                    Get In Touch
                                </span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black font-serif tracking-tight mb-3 md:mb-6 leading-[1.1]">
                                Let's build <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">something</span>
                            </h2>
                            <p className="text-slate-800 font-medium text-sm md:text-base leading-relaxed max-w-lg">
                                Whether you have a project idea, need a developer, or just want to connect, my inbox is always open.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 mt-8 w-full">
                            {/* Email Card */}
                            <div className="flex items-center gap-4 p-4 sm:p-5 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all duration-500 group w-full cursor-pointer">
                                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-all duration-500 shrink-0">
                                    <FaEnvelope size={16} />
                                </div>
                                <div className="text-left overflow-hidden">
                                    <h4 className="text-slate-400 font-mono text-[11px] font-bold mb-1 uppercase tracking-widest">Email</h4>
                                    <a href="mailto:azimsayyad90@gmail.com" className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate block">
                                        azimsayyad90@gmail.com
                                    </a>
                                </div>
                            </div>

                            {/* Phone Card */}
                            <div className="flex items-center gap-4 p-4 sm:p-5 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all duration-500 group w-full cursor-pointer">
                                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-all duration-500 shrink-0">
                                    <FaPhoneAlt size={14} />
                                </div>
                                <div className="text-left overflow-hidden">
                                    <h4 className="text-slate-400 font-mono text-[11px] font-bold mb-1 uppercase tracking-widest">Phone</h4>
                                    <a href="tel:+919075909896" className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate block">
                                        +91-9075909896
                                    </a>
                                </div>
                            </div>

                            {/* Location Card */}
                            <div className="flex items-center gap-4 p-4 sm:p-5 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all duration-500 group w-full cursor-pointer">
                                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-all duration-500 shrink-0">
                                    <FaMapMarkerAlt size={16} />
                                </div>
                                <div className="text-left overflow-hidden">
                                    <h4 className="text-slate-400 font-mono text-[11px] font-bold mb-1 uppercase tracking-widest">Location</h4>
                                    <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate block">
                                        India
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="h-full flex flex-col"
                    >
                        <form
                            onSubmit={handleSubmit}
                            className="bg-white p-6 sm:p-10 rounded-[2rem] border border-slate-100 shadow-xl relative overflow-hidden flex flex-col h-full"
                        >
                            {/* Decorative corner accent */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-indigo-50 to-cyan-50 rounded-full blur-2xl opacity-80 pointer-events-none"></div>

                            <h3 className="text-2xl font-black text-black font-serif mb-6 shrink-0">Send a Message</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 shrink-0">
                                <div>
                                    <label htmlFor="name" className="block text-[11px] font-bold text-slate-800 font-mono tracking-widest uppercase mb-2">Name <span className='text-rose-500'>*</span></label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full rounded-xl bg-slate-50 border-transparent hover:bg-slate-100 px-4 py-3 text-sm font-medium text-black focus:bg-white focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-[11px] font-bold text-slate-800 font-mono tracking-widest uppercase mb-2">Email <span className='text-rose-500'>*</span></label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full rounded-xl bg-slate-50 border-transparent hover:bg-slate-100 px-4 py-3 text-sm font-medium text-black focus:bg-white focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div className="mb-4 shrink-0">
                                <label htmlFor="subject" className="block text-[11px] font-bold text-slate-800 font-mono tracking-widest uppercase mb-2">Subject <span className='text-rose-500'>*</span></label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full rounded-xl bg-slate-50 border-transparent hover:bg-slate-100 px-4 py-3 text-sm font-medium text-black focus:bg-white focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                                    placeholder="Project Inquiry"
                                />
                            </div>

                            <div className="mb-8 flex-1 flex flex-col">
                                <label htmlFor="message" className="block text-[11px] font-bold text-slate-800 font-mono tracking-widest uppercase mb-2 shrink-0">Message <span className='text-rose-500'>*</span></label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full flex-1 rounded-xl bg-slate-50 border-transparent hover:bg-slate-100 px-4 py-3 text-sm font-medium text-black focus:bg-white focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all resize-none min-h-[120px]"
                                    placeholder="Hello, I'd like to talk about..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="group shrink-0 relative z-10 w-full inline-flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-[0.1em] font-bold text-white border border-slate-900 rounded-lg overflow-hidden px-5 py-3.5 md:px-6 md:py-4 bg-black bg-[length:200%_auto] bg-[position:200%_center] bg-no-repeat transition-all duration-500 ease-in-out hover:border-blue-600 hover:bg-[position:40%_center] shadow-md hover:shadow-indigo-500/25 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 531.28 200'%3E%3Cdefs%3E%3Cstyle%3E .shape %7B fill: %232563eb %7D %3C/style%3E%3C/defs%3E%3Cg id='Layer_2' data-name='Layer 2'%3E%3Cg id='Layer_1-2' data-name='Layer 1'%3E%3Cpolygon class='shape' points='415.81 200 0 200 115.47 0 531.28 0 415.81 200' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
                            >
                                <span className="relative z-10">
                                    {loading ? 'Sending...' : 'Send Message'}
                                </span>
                                {!loading && <FaPaperPlane size={12} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;
