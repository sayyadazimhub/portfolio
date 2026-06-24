import Hero from '../components/layout/Hero';
import FeaturedProjects from '../components/layout/FeaturedProjects';
import Testimonials from '../components/layout/Testimonials';
import FooterCTA from '../components/layout/FooterCTA';
import Skills from '../components/layout/Skills';
// import GithubSection from '../components/layout/GithubSection';

const Home = () => {
    return (
        <div>
            <Hero />
            <Skills />
            {/* <GithubSection /> */}
            <FeaturedProjects />
            <FooterCTA />
            <Testimonials />
        </div>
    );
};

export default Home;
