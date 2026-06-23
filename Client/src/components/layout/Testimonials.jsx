import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaArrowRight, FaQuoteLeft, FaStar, FaLinkedin, FaQuoteRight } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { apiService } from '../../utils/api';

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        company: '',
        linkedInUrl: '',
        message: '',
        image: null,
    });

    const selectedTestimonial = testimonials[currentIndex] || {};

    const handlePrev = () => {
        if (!testimonials.length) return;
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const handleNext = () => {
        if (!testimonials.length) return;
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    useEffect(() => {
        if (!testimonials.length || isPaused) return;

        const intervalId = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 7000);

        return () => clearInterval(intervalId);
    }, [testimonials, isPaused]);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await apiService.getTestimonials();
                const approvedTestimonials = (response.data.data || []).filter(t => t.status === 'approved');
                setTestimonials(approvedTestimonials);
            } catch (fetchError) {
                console.error('Error fetching testimonials:', fetchError);
                setError('Failed to load testimonials.');
            } finally {
                setLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, image: e.target.files[0] || null }));
    };

    const resetForm = () => {
        setFormData({
            name: '',
            role: '',
            company: '',
            linkedInUrl: '',
            message: '',
            image: null,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error('Name is required');
            return;
        }
        if (!formData.role.trim()) {
            toast.error('Role is required');
            return;
        }
        if (!formData.company.trim()) {
            toast.error('Company is required');
            return;
        }
        if (!formData.linkedInUrl.trim()) {
            toast.error('LinkedIn URL is required');
            return;
        }
        if (!formData.message.trim()) {
            toast.error('Message is required');
            return;
        }

        setSubmitting(true);

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('role', formData.role);
            data.append('company', formData.company);
            data.append('linkedInUrl', formData.linkedInUrl);
            data.append('message', formData.message);
            data.append('status', 'pending');
            if (formData.image) {
                data.append('image', formData.image);
            }

            const response = await apiService.postTestimonial(data);
            toast.success('Thank you! Your testimonial has been submitted.');
            resetForm();
            setShowForm(false);
        } catch (submitError) {
            console.error('Error submitting testimonial:', submitError);
            const backendErrors = submitError.response?.data?.errors;
            if (Array.isArray(backendErrors) && backendErrors.length > 0) {
                backendErrors.forEach((err) => toast.error(err));
            } else {
                const errorMessage = submitError.response?.data?.message || 'Failed to submit testimonial. Please try again.';
                toast.error(errorMessage);
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section id="testimonials" className="py-12 lg:py-16 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

                <div className="grid gap-0 md:gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
                    {/* Left Text Column */}
                    <div className="flex flex-col items-start gap-6 md:gap-8">
                        <div className="flex flex-col items-start">
                            <motion.h2 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] mb-2 sm:mb-3 text-indigo-600 font-bold flex items-center gap-2"
                            >
                                {/* <span className="w-6 h-0.5 bg-indigo-600 shrink-0"></span> */}
                                <span className="truncate">Client Feedback</span>
                            </motion.h2>
                            <motion.h3 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-3xl sm:text-4xl lg:text-5xl font-black text-black font-serif leading-[1.1] tracking-tight mb-4"
                            >
                                What People <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">Say.</span>
                            </motion.h3>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="text-slate-800 font-medium max-w-xl text-sm sm:text-base leading-relaxed text-justify md:text-left"
                            >
                                Hear directly from those who have experienced working together. Their words reflect the impact and value of our collaboration, showcasing the real-world benefits and successes we've achieved together.
                            </motion.p>
                        </div>

                        {testimonials.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                            >
                                <button
                                    type="button"
                                    onClick={() => setShowForm(true)}
                                    className="group inline-flex items-center justify-center gap-2 sm:gap-3 bg-white text-black border-2 border-black px-5 py-3 sm:px-6 sm:py-3.5 rounded-lg font-mono text-[10px] sm:text-xs uppercase tracking-[0.12em] font-bold hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 w-fit cursor-pointer"
                                >
                                    <span>Give Feedback</span>
                                    <FaArrowRight className="text-black group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-300" />
                                </button>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Slider Column */}
                    <div className="relative mt-10 lg:mt-0">
                        {testimonials.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative rounded-2xl md:rounded-[32px] bg-white border border-slate-100 flex flex-col items-center justify-center p-10 md:p-16 shadow-[0_8px_30px_rgb(0,0,0,0.06)] min-h-[350px] text-center"
                            >
                                <div className="h-20 w-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                                    <FaQuoteRight className="h-8 w-8 text-indigo-300" />
                                </div>
                                <h4 className="text-xl md:text-2xl font-bold text-black mb-3 font-serif">Be the first to share your experience</h4>
                                <p className="text-slate-600 mb-8 max-w-md">Your feedback means a lot! Click below to share your thoughts about our collaboration.</p>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(true)}
                                    className="group relative z-10 inline-flex items-center justify-center gap-2 sm:gap-3 font-mono text-[11px] sm:text-xs uppercase font-bold tracking-[0.15em] text-white border border-slate-900 rounded-lg overflow-hidden px-5 py-3 md:px-6 md:py-3.5 bg-black bg-[length:200%_auto] bg-[position:200%_center] bg-no-repeat transition-all duration-500 ease-in-out hover:border-blue-600 hover:bg-[position:40%_center] shadow-lg hover:shadow-indigo-500/25 cursor-pointer"
                                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 531.28 200'%3E%3Cdefs%3E%3Cstyle%3E .shape %7B fill: %232563eb %7D %3C/style%3E%3C/defs%3E%3Cg id='Layer_2' data-name='Layer 2'%3E%3Cg id='Layer_1-2' data-name='Layer 1'%3E%3Cpolygon class='shape' points='415.81 200 0 200 115.47 0 531.28 0 415.81 200' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
                                >
                                    <span className="relative z-10">Give Feedback</span>
                                    <FaArrowRight className="relative z-10 w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                                </button>
                            </motion.div>
                        ) : (
                            <>
                                {/* Minimalist Prev Arrow */}
                                {testimonials.length > 1 && (
                                    <div className="absolute -left-2 sm:-left-4 md:-left-6 top-1/2 -translate-y-1/2 transform z-20">
                                        <button
                                            type="button"
                                            onClick={handlePrev}
                                            className="group relative flex items-center justify-center bg-white hover:bg-slate-50 text-black border border-slate-200 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full shadow-md hover:shadow-lg transition-all duration-300 pointer-events-auto cursor-pointer"
                                            aria-label="Previous testimonial"
                                        >
                                            <FaArrowLeft className="text-indigo-500 w-3 h-3 md:w-4 md:h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                                        </button>
                                    </div>
                                )}

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={selectedTestimonial._id || currentIndex}
                                        initial={{ opacity: 0, scale: 0.88, x: 10 }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.88, x: 10 }}
                                        transition={{ duration: 0.45, ease: 'easeOut' }}
                                        onMouseEnter={() => setIsPaused(true)}
                                        onMouseLeave={() => setIsPaused(false)}
                                        className="relative rounded-2xl md:rounded-[32px] bg-white border border-slate-100 flex flex-col p-7 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
                                    >
                                        <div className="absolute top-10 right-10 text-indigo-500/5 pointer-events-none">
                                            <FaQuoteRight className="h-7 w-7 md:h-10 md:w-10" />
                                        </div>

                                        {/* Top Profile Section */}
                                        <div className="flex items-center gap-5 mb-8 relative z-10">
                                            <div className="h-16 w-16 md:h-20 md:w-20 overflow-hidden rounded-full border-[3px] border-white shadow-sm bg-slate-200 shrink-0">
                                                {selectedTestimonial.image ? (
                                                    <img
                                                        src={selectedTestimonial.image}
                                                        alt={selectedTestimonial.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-slate-600 font-light text-2xl">
                                                        {(selectedTestimonial.name || 'J').charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-xl tracking-tight">{selectedTestimonial.name || 'Julian Thorne'}</p>
                                                <p className="text-sm font-medium text-indigo-600 mt-0.5">
                                                    {selectedTestimonial.role || 'Director'}
                                                    {(selectedTestimonial.company) ? ` at ${selectedTestimonial.company}` : ''}
                                                </p>
                                                {/* Stars */}
                                                {/* <div className="flex items-center gap-1 mt-2 text-amber-400">
                                                    {[...Array(5)].map((_, idx) => (
                                                        <FaStar key={idx} className="h-2.5 w-2.5 md:h-3 md:w-3" />
                                                    ))}
                                                </div> */}
                                            </div>
                                        </div>

                                        {/* Quote Text */}
                                        <p className="relative z-10 px-4 text-slate-800 text-base md:text-lg text-justify min-h-[130px] max-h-[130px] overflow-y-auto custom-scrollbar">
                                            "{selectedTestimonial.message || 'The level of transparency provided has completely transformed how we handle client acquisitions. It’s an indispensable tool for our modern strategy.'}"
                                        </p>

                                        {/* Bottom Action */}
                                        <div className="mt-8 flex justify-start w-full relative z-10">
                                            {(selectedTestimonial.linkedInUrl || true) && (
                                                <a
                                                    href={selectedTestimonial.linkedInUrl || '#'}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-3 text-[10px] sm:text-xs font-bold text-black hover:text-[#0A66C2] transition-all duration-300 uppercase tracking-[0.2em] group cursor-pointer"
                                                >
                                                    <span className="h-[1px] w-6 bg-slate-300 group-hover:bg-[#0A66C2] group-hover:w-10 transition-all duration-300"></span>
                                                    Connect on LinkedIn
                                                    <FaLinkedin className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
                                                </a>
                                            )}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Minimalist Next Arrow */}
                                {testimonials.length > 1 && (
                                    <div className="absolute -right-2 sm:-right-4 md:-right-6 top-1/2 -translate-y-1/2 transform z-20">
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="group relative flex items-center justify-center bg-white hover:bg-slate-50 text-black border border-slate-200 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full shadow-md hover:shadow-lg transition-all duration-300 pointer-events-auto cursor-pointer"
                                            aria-label="Next testimonial"
                                        >
                                            <FaArrowRight className="text-indigo-500 w-3 h-3 md:w-4 md:h-4 transition-transform duration-300 group-hover:translate-x-1" />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {showForm && (
                    <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center px-4 py-8 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.25 }}
                            className="w-full max-w-xl max-h-[calc(100vh-3.5rem)] overflow-hidden rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200 flex flex-col"
                        >
                            <div className="flex flex-row items-start justify-between gap-4 mb-6 shrink-0">
                                <div>
                                    <h3 className="text-3xl font-black text-black font-serif tracking-tight">Share your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">experience.</span></h3>
                                    <p className="mt-1 text-sm font-medium text-slate-800">Submit a testimonial to show what it was like working together.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    aria-label="Close testimonial form"
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-black/90 transition-all hover:bg-slate-200 hover:text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 shrink-0 cursor-pointer"
                                >
                                    ✕
                                </button>
                            </div>

                            <motion.form
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.25, delay: 0.05 }}
                                onSubmit={handleSubmit}
                                className="space-y-5 overflow-y-auto pr-2 pb-2 custom-scrollbar flex-1"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="name" className="block text-[11px] font-bold text-slate-800 font-mono tracking-widest uppercase mb-2">Name <span className='text-rose-500'>*</span></label>
                                        <input
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full rounded-xl bg-slate-50 border-transparent hover:bg-slate-100 px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                                            placeholder="Your full name"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="role" className="block text-[11px] font-bold text-slate-800 font-mono tracking-widest uppercase mb-2">Role <span className='text-rose-500'>*</span></label>
                                        <input
                                            id="role"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            className="w-full rounded-xl bg-slate-50 border-transparent hover:bg-slate-100 px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                                            placeholder="Your role / title"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="company" className="block text-[11px] font-bold text-slate-800 font-mono tracking-widest uppercase mb-2">Company <span className='text-rose-500'>*</span></label>
                                        <input
                                            id="company"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            className="w-full rounded-xl bg-slate-50 border-transparent hover:bg-slate-100 px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                                            placeholder="Company or organization"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="linkedInUrl" className="block text-[11px] font-bold text-slate-800 font-mono tracking-widest uppercase mb-2">LinkedIn URL <span className='text-rose-500'>*</span></label>
                                        <input
                                            id="linkedInUrl"
                                            name="linkedInUrl"
                                            type="url"
                                            value={formData.linkedInUrl}
                                            onChange={handleChange}
                                            className="w-full rounded-xl bg-slate-50 border-transparent hover:bg-slate-100 px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                                            placeholder="https://linkedin.com/in/profile"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-[11px] font-bold text-slate-800 font-mono tracking-widest uppercase mb-2">Message <span className='text-rose-500'>*</span></label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full rounded-xl bg-slate-50 border-transparent hover:bg-slate-100 px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
                                        placeholder="Share your experience working together..."
                                    />
                                </div>

                                <div>
                                    <label htmlFor="image" className="block text-[11px] font-bold text-slate-800 font-mono tracking-widest uppercase mb-2">Profile Image</label>

                                    <div className="flex items-center gap-4 group/upload">
                                        {/* Image Preview */}
                                        <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-full overflow-hidden border-2 border-slate-100 bg-slate-50 shadow-sm">
                                            {formData.image ? (
                                                <>
                                                    <img
                                                        src={URL.createObjectURL(formData.image)}
                                                        alt="Preview"
                                                        className="h-full w-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => setFormData(prev => ({ ...prev, image: null }))}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-white">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-slate-300">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        {/* Upload Control */}
                                        <div className="relative flex-1 h-14 sm:h-16">
                                            <input
                                                id="image"
                                                name="image"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="flex items-center gap-3 px-4 py-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 group-hover/upload:bg-indigo-50 group-hover/upload:border-indigo-300 transition-all h-full w-full">
                                                <div className="bg-white p-1.5 rounded-lg shadow-sm text-indigo-600 shrink-0">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                                    </svg>
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-xs font-semibold text-slate-800 truncate">{formData.image ? 'Change Photo' : 'Upload Photo'}</p>
                                                    <p className="text-[10px] text-slate-500 font-medium truncate">JPEG, PNG, or GIF (max 2MB)</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 pt-4 md:flex-row md:justify-end border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="inline-flex items-center justify-center rounded-xl bg-slate-100 px-5 py-3 md:px-6 md:py-3.5 text-sm font-bold text-black transition hover:bg-slate-200 hover:text-indigo-600 cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="group relative z-10 inline-flex items-center justify-center gap-2 font-mono text-xs uppercase font-bold tracking-[0.1em] text-white border border-black rounded-lg overflow-hidden px-5 py-3 md:px-6 md:py-3.5 bg-black bg-[length:200%_auto] bg-[position:200%_center] bg-no-repeat transition-all duration-500 ease-in-out hover:border-blue-600 hover:bg-[position:40%_center] shadow-lg hover:shadow-indigo-500/25 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                                        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 531.28 200'%3E%3Cdefs%3E%3Cstyle%3E .shape %7B fill: %232563eb %7D %3C/style%3E%3C/defs%3E%3Cg id='Layer_2' data-name='Layer 2'%3E%3Cg id='Layer_1-2' data-name='Layer 1'%3E%3Cpolygon class='shape' points='415.81 200 0 200 115.47 0 531.28 0 415.81 200' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
                                    >
                                        <span className="relative z-10">{submitting ? 'Submitting...' : 'Submit Testimonial'}</span>
                                    </button>
                                </div>
                            </motion.form>
                        </motion.div>
                    </div>
                )}

            </div>
        </section>
    );
};

export default Testimonials;
