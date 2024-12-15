import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface SocialIconProps {
  icon: LucideIcon;
  href: string;
}

export const SocialIcon = ({ icon: Icon, href }: SocialIconProps) => {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.1 }}
      className="rounded-full bg-gray-800 p-3 text-gray-400 transition-colors hover:bg-gray-700 hover:text-orange-500"
    >
      <Icon className="h-6 w-6" />
    </motion.a>
  );
};