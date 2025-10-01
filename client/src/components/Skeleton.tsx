import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  rounded?: boolean;
  delay?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  className = '',
  rounded = true,
  delay = 0
}) => {
  return (
    <motion.div
      className={`bg-gray-200 ${rounded ? 'rounded' : ''} ${className}`}
      style={{ width, height }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay * 0.1 }}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
          delay: delay * 0.1
        }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          width: '100%',
          height: '100%'
        }}
      />
    </motion.div>
  );
};

interface SkeletonCardProps {
  delay?: number;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1 }}
      className="bg-white p-6 rounded-xl shadow-xl"
    >
      <div className="flex items-center space-x-4">
        <Skeleton width={48} height={48} rounded className="rounded-lg" delay={delay} />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height={16} delay={delay + 1} />
          <Skeleton width="40%" height={24} delay={delay + 2} />
          <Skeleton width="30%" height={12} delay={delay + 3} />
        </div>
      </div>
    </motion.div>
  );
};

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  delay?: number;
}

const SkeletonTable: React.FC<SkeletonTableProps> = ({ 
  rows = 5, 
  columns = 4, 
  delay = 0 
}) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              width={`${100 / columns}%`}
              height={20}
              delay={delay + rowIndex + colIndex}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export { Skeleton, SkeletonCard, SkeletonTable };
