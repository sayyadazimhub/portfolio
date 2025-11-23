import { motion } from 'framer-motion';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';

const Testimonials = () => {
    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Senior Developer',
            company: 'Tech Corp',
            text: 'Sayyad is a dedicated developer who always strives for excellence. His ability to solve complex problems is impressive.',
            rating: 5,
        },
        {
            name: 'Michael Chen',
            role: 'Project Manager',
            company: 'Digital Solutions',
            text: 'Working with Sayyad was a pleasure. He delivers high-quality code on time and communicates effectively.',
            rating: 5,
        },
        {
            name: 'Emily Davis',
            role: 'Client',
            company: 'StartUp Inc',
            text: 'I was blown away by the website Sayyad built for me. It exceeded my expectations in every way.',
            rating: 5,
        },
    ];

    return (
        <section id="testimonials" className="py-24 bg-gradient-to-b from-secondary to-primary relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >


                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 pb-2 border-b-2 border-accent/30 inline-block">
                        What People Say
                    </h2>
                    <p className="text-gray-400 mt-2">Don't just take my word for it</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative bg-gradient-to-br from-secondary/50 to-primary/50 backdrop-blur-sm p-8 rounded-2xl border border-accent/20 hover:border-accent/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-accent/10"
                        >
                            {/* Quote icon with gradient background */}
                            <div className="absolute -top-4 -left-4 p-4 bg-gradient-to-br from-accent to-purple-500 rounded-xl shadow-lg">
                                <FaQuoteLeft className="text-white text-2xl" />
                            </div>

                            {/* Rating stars */}
                            <div className="flex gap-1 mb-4 mt-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <FaStar key={i} className="text-accent text-sm" />
                                ))}
                            </div>

                            {/* Testimonial text */}
                            <p className="text-gray-300 mb-6 italic leading-relaxed">
                                "{testimonial.text}"
                            </p>

                            {/* Author info */}
                            <div className="border-t border-accent/20 pt-4">
                                <h4 className="text-white font-bold text-lg mb-1">{testimonial.name}</h4>
                                <p className="text-accent text-sm font-medium">{testimonial.role}</p>
                                <p className="text-gray-500 text-xs">{testimonial.company}</p>
                            </div>

                            {/* Hover glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
