import AboutComponent from '../components/layout/About';
import Experience from '../components/layout/Experience';
import Education from '../components/layout/Education';

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
