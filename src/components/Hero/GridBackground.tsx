import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

export const GridBackground = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: [0, 1],
      transition: { duration: 1 }
    });
  }, [controls]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={controls}
      className="grid-background absolute inset-0"
    >
      {Array.from({ length: 400 }).map((_, i) => (
        <div
          key={i}
          className="grid-line absolute h-px w-px"
          style={{
            left: `${(i % 20) * 5}%`,
            top: `${Math.floor(i / 20) * 5}%`,
            width: '1px',
            height: '1px',
          }}
        />
      ))}
    </motion.div>
  );
};