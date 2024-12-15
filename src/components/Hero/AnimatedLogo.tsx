import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';

export const AnimatedLogo = () => {
  return (
    <motion.div
      animate={{
        rotate: [0, 360],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }}
      className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-orange-500/10"
    >
      <Code2 className="h-16 w-16 text-orange-500" />
    </motion.div>
  );
};