import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ProjectCard } from './ProjectCard';
import { projects } from './projectData';

export const Portfolio = () => {
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
          My Work
        </motion.h2>
        
        <div className="grid gap-8 md:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={index}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};