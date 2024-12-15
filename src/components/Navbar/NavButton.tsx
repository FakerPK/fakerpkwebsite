import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface NavButtonProps {
  icon: LucideIcon;
  label: string;
}

export const NavButton = ({ icon: Icon, label }: NavButtonProps) => {
  return (
    <button className="group flex items-center gap-2 text-gray-300 transition-colors hover:text-orange-500">
      <Icon className="h-5 w-5" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};