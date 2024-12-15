import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { TechButton } from './TechButton';
import { technologies } from './techData';

export const Technologies = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="py-20">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="mb-12 text-center text-4xl font-bold"
        >
          Technologies I Work With
        </motion.h2>
        
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
          {technologies.map((tech, index) => (
            <TechButton
              key={tech.name}
              {...tech}
              index={index}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};