import React, { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
  fallbackElement?: React.ReactNode;
  onError?: () => void;
}

const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackText = 'Imagem não disponível',
  fallbackElement,
  onError
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  if (hasError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        {fallbackElement || (
          <p className="text-gray-500 text-center">{fallbackText}</p>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0 absolute' : 'opacity-100'}`}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
};

export default SafeImage;
