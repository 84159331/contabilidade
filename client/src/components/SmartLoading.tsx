import React, { useEffect, useState } from 'react';

// ImportaÃ§Ã£o segura do framer-motion com fallback
let MotionDiv: React.ComponentType<any>;
try {
  const framerMotion = require('framer-motion');
  if (framerMotion && framerMotion.motion && framerMotion.motion.div) {
    MotionDiv = framerMotion.motion.div;
  } else {
    throw new Error('motion.div nÃ£o disponÃ­vel');
  }
} catch (error) {
  // Fallback: usar div padrÃ£o (sem log em produÃ§Ã£o)
  if (process.env.NODE_ENV === 'development') {
    console.warn('âš ï¸ framer-motion nÃ£o disponÃ­vel, usando div padrÃ£o');
  }
  MotionDiv = ({ children, ...props }: any) => <div {...props}>{children}</div>;
}

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
    // Simula um delay mÃ­nimo para evitar flash de conteÃºdo
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowContent(true);
    }, preloadDelay);

    return () => clearTimeout(timer);
  }, [preloadDelay]);

  // Props de animaÃ§Ã£o apenas se motion.div estiver disponÃ­vel
  const hasMotion = MotionDiv.name !== 'SmartLoading' && MotionDiv !== (() => <div />);
  const loadingProps = hasMotion ? {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 }
  } : {};

  if (isLoading) {
    return (
      <MotionDiv
        {...loadingProps}
        className="flex items-center justify-center min-h-[200px]"
      >
        {fallback || (
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Carregando...</p>
          </div>
        )}
      </MotionDiv>
    );
  }

  const contentProps = hasMotion ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: "easeOut" }
  } : {};

  return (
    <MotionDiv {...contentProps}>
      {showContent && children}
    </MotionDiv>
  );
};

export default SmartLoading;
