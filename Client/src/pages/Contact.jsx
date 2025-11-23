import ContactComponent from '../components/layout/ContactForm';
import { motion } from 'framer-motion';

const Contact = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <ContactComponent />
        </motion.div>
    );
};

export default Contact;
