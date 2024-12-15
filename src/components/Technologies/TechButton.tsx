import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface TechButtonProps {
  icon: LucideIcon;
  name: string;
  index: number;
  inView: boolean;
}

export const TechButton = ({ icon: Icon, name, index, inView }: TechButtonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1 }}
      className="tech-button"
    >
      <div className="flex flex-col items-center gap-3">
        <Icon className="h-10 w-10 text-orange-500" />
        <span className="text-sm font-medium">{name}</span>
      </div>
    </motion.div>
  );
};