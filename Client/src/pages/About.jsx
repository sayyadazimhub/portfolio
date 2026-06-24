import AboutComponent from '../components/layout/About';
import Experience from '../components/layout/Experience';
import { motion } from 'framer-motion';

import Certifications from '../components/layout/Certifications';

const About = () => {
    return (
        <div>
            <AboutComponent />
            <Education />
            <Experience />
            <Certifications />
        </div>
    );
};

export default About;
