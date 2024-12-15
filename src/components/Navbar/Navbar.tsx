import { motion } from 'framer-motion';
import { NavButton } from './NavButton';
import { navItems } from './navData';

export const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed left-1/2 top-8 z-50 -translate-x-1/2"
    >
      <div className="navbar flex items-center gap-8 px-8 py-3">
        {navItems.map((item) => (
          <NavButton key={item.label} {...item} />
        ))}
      </div>
    </motion.nav>
  );
};