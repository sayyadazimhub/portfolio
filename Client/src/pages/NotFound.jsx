import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-primary px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <h1 className="text-9xl font-bold text-accent mb-4">404</h1>
                <h2 className="text-3xl font-semibold text-white mb-6">Page Not Found</h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <Link
                    to="/"
                    className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-accent to-purple-500 text-white font-semibold hover:opacity-90 transition-opacity"
                >
                    Go Home
                </Link>
            </motion.div>
        </div>
    );
};

export default NotFound;
