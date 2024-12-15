import { motion } from 'framer-motion';
import { SocialIcon } from './SocialIcon';
import { socialLinks } from './socialData';

export const Contact = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="mb-12 rounded-full bg-orange-500 px-8 py-3 font-medium text-white transition-shadow hover:shadow-lg hover:shadow-orange-500/25"
        >
          Contact Me
        </motion.button>
        
        <div className="flex justify-center gap-6">
          {socialLinks.map((social) => (
            <SocialIcon key={social.href} {...social} />
          ))}
        </div>
      </div>
    </section>
  );
};