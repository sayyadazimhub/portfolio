
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { FaWhatsapp } from 'react-icons/fa';

const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen max-w-[1700px] mx-auto bg-white relative">
            <Navbar />
            <main className="flex-grow pt-0">
                <Outlet />
            </main>
            <Footer />

            {/* WhatsApp Floating Action Button */}
            <a
                href="https://wa.me/919075909896"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-110 transition-all duration-300 group flex items-center justify-center"
                aria-label="Chat on WhatsApp"
                title="Chat on WhatsApp"
            >
                <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30 group-hover:animate-none"></span>
                <FaWhatsapp className="w-7 h-7 md:w-8 md:h-8 relative z-10" />
            </a>
        </div>
    );
};

export default MainLayout;
