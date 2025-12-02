import React, { useState, useRef, useEffect } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
  fallbackElement?: React.ReactNode;
  onError?: () => void;
  loading?: 'lazy' | 'eager';
  priority?: boolean; // Para imagens acima da dobra
}

const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackText = 'Imagem não disponível',
  fallbackElement,
  onError,
  loading = 'lazy',
  priority = false
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldLoad, setShouldLoad] = useState(priority || loading === 'eager');
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer para lazy loading eficiente
  useEffect(() => {
    if (shouldLoad || loading === 'eager' || priority) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Começar a carregar 50px antes de entrar na viewport
        threshold: 0.01
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [shouldLoad, loading, priority]);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    if (onError) {
      onError();
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // Reset quando src mudar
  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
    setShouldLoad(priority || loading === 'eager');
  }, [src, priority, loading]);

  if (!src) {
    return (
      <div ref={containerRef} className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}>
        <div className="text-center p-4">
          <div className="text-gray-400 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Sem imagem</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div ref={containerRef} className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}>
        {fallbackElement || (
          <div className="text-center p-4">
            <div className="text-gray-400 mb-2">
              <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{fallbackText}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Skeleton/Placeholder durante carregamento */}
      {isLoading && (
        <div className={`absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse ${className}`}>
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
      )}
      
      {/* Imagem otimizada */}
      {shouldLoad && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'} ${!shouldLoad ? 'hidden' : ''}`}
          loading={loading}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onError={handleError}
          onLoad={handleLoad}
        />
      )}
    </div>
  );
};

export default SafeImage;
