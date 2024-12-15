import { motion, useAnimation } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useEffect } from 'react';

interface NavButtonProps {
  icon: LucideIcon;
  label: string;
}

export const NavButton = ({ icon: Icon, label }: NavButtonProps) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      scale: [1, 1.1, 1],
      transition: { duration: 1, repeat: Infinity }
    });
  }, [controls]);

  return (
    <motion.button 
      whileHover={{ scale: 1.1 }}
      className="group flex items-center gap-2 text-gray-300 transition-colors hover:text-orange-500"
    >
      <Icon className="h-5 w-5" />
      <span className="text-sm font-medium">{label}</span>
    </motion.button>
  );
};