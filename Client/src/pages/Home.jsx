import Hero from '../components/layout/Hero';
import FeaturedProjects from '../components/layout/FeaturedProjects';
import Testimonials from '../components/layout/Testimonials';
import FooterCTA from '../components/layout/FooterCTA';
import { motion } from 'framer-motion';
import Skills from '../components/layout/Skills';
// import GithubSection from '../components/layout/GithubSection';

const Home = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Hero />
            <Skills />
            {/* <GithubSection /> */}
            <FeaturedProjects />
            <FooterCTA />
            <Testimonials />
        </motion.div>
    );
};

export default Home;
