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
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleError = () => {
    console.log('❌ Erro ao carregar imagem:', currentSrc);
    console.log('🔍 Tipo da src:', typeof currentSrc);
    console.log('🔍 É base64?', currentSrc.startsWith('data:'));
    console.log('🔍 É blob?', currentSrc.startsWith('blob:'));
    console.log('🔍 É URL?', currentSrc.startsWith('http'));
    
    // Para imagens base64, não tentar fallback
    if (currentSrc.startsWith('data:')) {
      console.log('❌ Imagem base64 falhou, mostrando erro');
      setHasError(true);
      setIsLoading(false);
      if (onError) {
        onError();
      }
      return;
    }
    
    // Tentar fallback para placeholder genérico apenas para URLs
    if (currentSrc !== '/img/placeholder.png') {
      console.log('🔄 Tentando fallback para placeholder...');
      setCurrentSrc('/img/placeholder.png');
      setIsLoading(true);
      return;
    }
    
    // Se o placeholder também falhar, mostrar erro
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
  React.useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  if (hasError) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}>
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
    <div className="relative">
      {isLoading && (
        <div className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0 absolute' : 'opacity-100'}`}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
};

export default SafeImage;
