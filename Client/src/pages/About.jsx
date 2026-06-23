import AboutComponent from '../components/layout/About';
import Experience from '../components/layout/Experience';
import Education from '../components/layout/Education';
import { motion } from 'framer-motion';

import Certifications from '../components/layout/Certifications';

const About = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <AboutComponent />



            <Education />



            <Experience />



            <Certifications />

            
        </motion.div>
    );
};

export default About;
