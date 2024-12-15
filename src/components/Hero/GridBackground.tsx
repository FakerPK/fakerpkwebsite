import { motion } from 'framer-motion';

export const GridBackground = () => {
  return (
    <div className="grid-background absolute inset-0">
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
    </div>
  );
};