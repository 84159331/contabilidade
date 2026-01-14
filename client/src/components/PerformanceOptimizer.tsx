import React, { useState, useEffect } from 'react';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
}

const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({ children }) => {
  const [isOptimized, setIsOptimized] = useState(false);

  useEffect(() => {
    // OtimizaÃ§Ãµes de performance
    const optimizePerformance = () => {
      // 1. Prefetch de recursos crÃ­ticos
      const prefetchResources = () => {
        const criticalResources = [
          '/static/css/main.css',
          '/static/js/main.js'
        ];

        criticalResources.forEach(resource => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = resource;
          document.head.appendChild(link);
        });
      };

      // 2. OtimizaÃ§Ãµes de imagem
      const optimizeImages = () => {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
          if (!img.loading) {
            img.loading = 'lazy';
          }
        });
      };

      // 3. OtimizaÃ§Ãµes de scroll
      const optimizeScroll = () => {
        // Remove scroll suave desnecessÃ¡rio durante carregamento
        document.documentElement.style.scrollBehavior = 'auto';
        setTimeout(() => {
          document.documentElement.style.scrollBehavior = 'smooth';
        }, 1000);
      };

      // 4. OtimizaÃ§Ãµes de animaÃ§Ã£o
      const optimizeAnimations = () => {
        // Reduz animaÃ§Ãµes em dispositivos lentos
        const isSlowDevice = navigator.hardwareConcurrency <= 2;
        if (isSlowDevice) {
          document.documentElement.style.setProperty('--animation-duration', '0.1s');
        }
      };

      prefetchResources();
      optimizeImages();
      optimizeScroll();
      optimizeAnimations();

      setIsOptimized(true);
    };

    // Executa otimizaÃ§Ãµes apÃ³s um pequeno delay
    const timer = setTimeout(optimizePerformance, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={isOptimized ? 'optimized' : 'loading'}>
      {children}
    </div>
  );
};

export default PerformanceOptimizer;
