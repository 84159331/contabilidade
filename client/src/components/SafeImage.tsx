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

  console.log('🖼️ SafeImage renderizado com src:', src ? src.substring(0, 50) + '...' : 'vazio');
  console.log('🖼️ SafeImage - É base64?', src?.startsWith('data:'));
  console.log('🖼️ SafeImage - É blob?', src?.startsWith('blob:'));
  console.log('🖼️ SafeImage - É URL?', src?.startsWith('http'));

  const handleError = () => {
    console.log('❌ SafeImage - Erro ao carregar:', src ? src.substring(0, 50) + '...' : 'vazio');
    setHasError(true);
    setIsLoading(false);
    if (onError) {
      onError();
    }
  };

  const handleLoad = () => {
    console.log('✅ SafeImage - Imagem carregada com sucesso');
    setIsLoading(false);
  };

  // Reset quando src mudar
  React.useEffect(() => {
    console.log('🔄 SafeImage - src mudou para:', src ? src.substring(0, 50) + '...' : 'vazio');
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  if (!src) {
    console.log('⚠️ SafeImage - src vazio, mostrando fallback');
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}>
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
    console.log('❌ SafeImage - Mostrando erro');
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
