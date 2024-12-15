import { motion } from 'framer-motion';
import { GridBackground } from './GridBackground';
import { AnimatedLogo } from './AnimatedLogo';

export const Hero = () => {
  return (
    <div className="relative min-h-screen">
      <GridBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex min-h-screen items-center justify-center"
      >
        <div className="text-center">
          <AnimatedLogo />
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4 text-6xl font-bold"
          >
            John Doe
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-400"
          >
            Full Stack Developer
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};