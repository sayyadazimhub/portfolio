import AboutComponent from '../components/layout/About';
import Experience from '../components/layout/Experience';
import Education from '../components/layout/Education';
import Certifications from '../components/layout/Certifications';
import FAQSection from '../components/layout/FAQSection';
import { Helmet } from 'react-helmet-async';

const About = () => {
    return (
        <div>
            <Helmet>
                <title>About Me | Sayyad Azim - Full-Stack Developer</title>
                <meta name="description" content="Learn more about Sayyad Azim's experience, education, and journey as a MERN Stack Developer in Hyderabad." />
                <link rel="canonical" href="https://azim-sayyad-portfolio.vercel.app/about" />
            </Helmet>
            <AboutComponent />
            <Education />
            <Experience />
            <Certifications />
            <FAQSection />
        </div>
    );
};

export default About;
