import Hero from '../components/layout/Hero';
import FeaturedProjects from '../components/layout/FeaturedProjects';
import Testimonials from '../components/layout/Testimonials';
import FooterCTA from '../components/layout/FooterCTA';
import Skills from '../components/layout/Skills';
import FAQSection from '../components/layout/FAQSection';
import { Helmet } from 'react-helmet-async';
// import GithubSection from '../components/layout/GithubSection';

const Home = () => {
    return (
        <div>
            <Helmet>
                <title>Sayyad Azim | Full-Stack MERN Developer based in Hyderabad</title>
                <meta name="description" content="Sayyad Azim is an experienced full-stack MERN developer based in Hyderabad. View scalable web applications and platforms developed using JS and Node." />
                <link rel="canonical" href="https://azim-sayyad-portfolio.vercel.app/" />
            </Helmet>
            <Hero />
            <Skills />
            {/* <GithubSection /> */}
            <FeaturedProjects />
            <FooterCTA />
            <Testimonials />
            <FAQSection />
        </div>
    );
};

export default Home;
