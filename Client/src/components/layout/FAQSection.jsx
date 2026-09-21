import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const faqs = [
    {
        question: "Who is a MERN stack developer in Hyderabad?",
        answer: "Sayyad Azim is a Full-Stack MERN Developer based in Hyderabad, India. He specializes in building robust and scalable web applications using MongoDB, Express.js, React, and Node.js. With a passion for cloud computing and modern architectures, he delivers high-performance digital solutions for businesses."
    },
    {
        question: "What projects has Sayyad Azim built?",
        answer: "Azim has built diverse full-stack applications, including E-Commerce platforms with Razorpay integration, real-time chat applications using Socket.io, and comprehensive hospital management systems. He focuses on responsive UI design, secure authentication, and seamless user experiences."
    },
    {
        question: "What tech stack does Sayyad Azim use?",
        answer: "Azim's extensive tech stack includes frontend technologies like React.js, Next.js, Redux, and Tailwind CSS. On the backend, he uses Node.js, Express.js, and RESTful APIs with JWT authentication. His database expertise spans MongoDB, MySQL, Prisma, and Sequelize ORM. He also utilizes tools like Git, GitHub, Postman, Figma, and Socket.IO for real-time communication."
    },
    {
        question: "What are Sayyad Azim's professional certifications?",
        answer: "Azim holds verified credentials in advanced web development and software engineering. These include certifications in React development, backend integrations with Node.js, and cloud computing fundamentals. His continuous learning ensures he stays updated with industry best practices."
    },
    {
        question: "How can I contact Sayyad Azim for freelance work?",
        answer: "You can contact Sayyad Azim directly through the contact form on this portfolio website, or reach out via his LinkedIn profile. He is available for freelance projects, full-time corporate roles, and open-source collaborations worldwide."
    }
];

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(0);

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <section className="py-12 md:py-16 bg-white relative border-t border-slate-100">
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify(faqSchema)}
                </script>
            </Helmet>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <div className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] mb-2 text-indigo-600 font-bold">
                        Common Questions
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-black font-serif tracking-tight">
                        Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">Questions</span>
                    </h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div 
                            key={index}
                            className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden transition-all duration-300"
                        >
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full px-4 py-4 sm:px-6 sm:py-5 text-left flex justify-between items-center focus:outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                            >
                                <h3 className="text-base sm:text-lg font-bold text-slate-900 pr-4 font-serif">
                                    {faq.question}
                                </h3>
                                <div className="text-indigo-600 shrink-0">
                                    {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                                </div>
                            </button>
                            <div 
                                className={`px-4 sm:px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-[500px] pb-4 sm:pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
