import { motion } from 'framer-motion';
import { Project } from './types';

interface ProjectCardProps {
  project: Project;
  index: number;
  inView: boolean;
}

export const ProjectCard = ({ project, index, inView }: ProjectCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.2 }}
      whileHover={{ scale: 1.05 }}
      className="group relative overflow-hidden rounded-xl bg-gray-800"
    >
      <div className="aspect-video overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      
      <div className="p-6">
        <h3 className="mb-2 text-xl font-bold">{project.title}</h3>
        <p className="mb-4 text-gray-400">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-orange-500/10 px-3 py-1 text-sm text-orange-500"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};