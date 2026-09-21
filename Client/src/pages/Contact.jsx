import ContactComponent from '../components/layout/ContactForm';
import { Helmet } from 'react-helmet-async';

const Contact = () => {
    return (
        <div>
            <Helmet>
                <title>Contact Me | Sayyad Azim</title>
                <meta name="description" content="Get in touch with Sayyad Azim for freelance opportunities, full-time roles, or just to say hi." />
                <link rel="canonical" href="https://azim-sayyad-portfolio.vercel.app/contact" />
            </Helmet>
            <ContactComponent />
        </div>
    );
};

export default Contact;
