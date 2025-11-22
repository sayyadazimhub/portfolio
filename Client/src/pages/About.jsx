import AboutComponent from '../components/About';
import Skills from '../components/Skills';
import Experience from '../components/Experience';
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
            <Skills />
            <Experience />
        </motion.div>
    );
};

export default About;
