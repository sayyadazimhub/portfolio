import Hero from '../components/layout/Hero';
// import Testimonials from '../components/layout/Testimonials';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Hero />
            {/* <Testimonials /> */}
        </motion.div>
    );
};

export default Home;
