import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { FaPaperPlane } from 'react-icons/fa';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await api.post('/contact', formData);
            setStatus({ type: 'success', message: 'Message sent successfully!' });
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="contact" className="py-20 bg-primary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    {/* <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get In Touch</h2>
                    <div className="w-20 h-1 bg-accent mx-auto rounded"></div>
                    <p className="text-gray-400 mt-4">Have a project in mind? Let's work together.</p> */}

                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-white via-accent to-purple-400 bg-clip-text text-transparent">
                            Get In Touch
                        </span>
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-accent to-purple-500 mx-auto rounded-full"></div>
                    <p className="text-gray-400 mt-4">Have a project in mind? Let's work together.</p>
                </motion.div>

                <div className="max-w-3xl mx-auto">
                    <motion.form
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        onSubmit={handleSubmit}
                        className="bg-secondary/30 p-8 rounded-2xl border border-gray-700 shadow-2xl"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-primary border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-primary border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows="5"
                                className="w-full bg-primary border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none"
                                placeholder="Your message..."
                            ></textarea>
                        </div>

                        {status.message && (
                            <div className={`mb-6 p-4 rounded-lg ${status.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {status.message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-transparent border-2 border-accent py-4 rounded-lg hover:bg-accent/10 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            <span className="font-bold text-lg bg-gradient-to-r from-accent via-purple-400 to-accent bg-clip-text text-transparent group-hover:from-white group-hover:via-accent group-hover:to-white transition-all duration-300">
                                {loading ? 'Sending...' : 'Send Message'}
                            </span>
                            {!loading && <FaPaperPlane className="text-accent group-hover:text-white transition-colors duration-300" />}
                        </button>
                    </motion.form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
