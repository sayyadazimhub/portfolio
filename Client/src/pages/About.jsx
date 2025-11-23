import AboutComponent from '../components/layout/About';
import Skills from '../components/layout/Skills';
import Experience from '../components/layout/Experience';
import Education from '../components/layout/Education';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <AboutComponent />

            {/* Decorative line separator */}
            <div className="relative h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>

            <Education />

            {/* Decorative line separator */}
            <div className="relative h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>

            <Experience />

            {/* Decorative line separator */}
            <div className="relative h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>

            <Skills />
            
        </motion.div>
    );
};

export default About;
