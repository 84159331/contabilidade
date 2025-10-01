import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SmartLoadingProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  preloadDelay?: number;
}

const SmartLoading: React.FC<SmartLoadingProps> = ({ 
  children, 
  fallback, 
  preloadDelay = 100 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Simula um delay mínimo para evitar flash de conteúdo
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowContent(true);
    }, preloadDelay);

    return () => clearTimeout(timer);
  }, [preloadDelay]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-center min-h-[200px]"
      >
        {fallback || (
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Carregando...</p>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {showContent && children}
    </motion.div>
  );
};

export default SmartLoading;
