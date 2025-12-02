import React, { useState } from 'react';
import { FaYoutube } from 'react-icons/fa';
import SafeImage from '../../components/SafeImage';

const FaYoutubeIcon = FaYoutube as any;

// IDs de vídeos do canal (você pode atualizar com os vídeos reais do canal)
// Para obter o ID, pegue a URL do vídeo: https://www.youtube.com/watch?v=VIDEO_ID
// Exemplo: Se a URL é https://www.youtube.com/watch?v=dQw4w9WgXcQ, o ID é: dQw4w9WgXcQ
const VIDEOS_DESTAQUE: string[] = [
  'ZoYuZfbWuvg', // Vídeo adicionado
  'F5EtGh5Qr24', // Vídeo em destaque
  'MJ-szYCspIY', // Vídeo em destaque
  'HCZLNjWVu4E', // Vídeo em destaque
];

// Componente de thumbnail de vídeo
interface VideoThumbnailProps {
  videoId: string;
  title?: string;
  onSelect: (videoId: string) => void;
}

const VideoThumbnail = React.memo<VideoThumbnailProps>(({ videoId, title, onSelect }) => {
  // URLs de thumbnail do YouTube em ordem de prioridade
  const thumbnailUrls = [
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`, // Alta resolução
    `https://img.youtube.com/vi/${videoId}/sddefault.jpg`, // Padrão SD
    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`, // Alta qualidade
  ];

  const [currentThumbnailIndex, setCurrentThumbnailIndex] = useState(0);

  const handleImageError = () => {
    // Tenta a próxima URL de thumbnail se a atual falhar
    if (currentThumbnailIndex < thumbnailUrls.length - 1) {
      setCurrentThumbnailIndex(currentThumbnailIndex + 1);
    }
  };
  
  return (
    <div
      onClick={() => onSelect(videoId)}
      className="relative group cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
    >
      <div className="aspect-video relative bg-gray-200 dark:bg-gray-700">
        <img
          src={thumbnailUrls[currentThumbnailIndex]}
          alt={title || `Vídeo ${videoId}`}
          className="w-full h-full object-cover"
          onError={handleImageError}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="bg-red-600 rounded-full p-4 transform group-hover:scale-110 transition-transform">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      {title && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <p className="text-white text-sm font-semibold line-clamp-2">{title}</p>
        </div>
      )}
    </div>
  );
});

VideoThumbnail.displayName = 'VideoThumbnail';

// Componente do player do YouTube
interface YouTubePlayerProps {
  videoId: string;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId }) => {
  return (
    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
      <iframe
        className="absolute top-0 left-0 w-full h-full rounded-xl"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

const WatchPage: React.FC = () => {
  const [videoSelecionado, setVideoSelecionado] = useState<string | null>(null);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 min-h-screen">
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <SafeImage 
              src="/img/ICONE-RESGATE.png" 
              alt="Comunidade Cristã Resgate" 
              className="mx-auto h-20 w-20 mb-6"
            />
            <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-gray-900 dark:text-white mb-4">
              Assista
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
              Assista às nossas mensagens mais recentes, cultos, estudos bíblicos e muito mais. 
              Acompanhe toda a programação da Comunidade Cristã Resgate.
            </p>
            <a
              href="https://youtube.com/@comunidadecresgate"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <FaYoutubeIcon className="h-6 w-6" />
              <span>Inscreva-se no nosso canal</span>
            </a>
          </div>

          {/* Player do vídeo selecionado */}
          {videoSelecionado && (
            <div className="mb-12">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Vídeo em destaque
                  </h2>
                  <button
                    onClick={() => setVideoSelecionado(null)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <YouTubePlayer videoId={videoSelecionado} />
              </div>
            </div>
          )}

          {/* Grid de vídeos do canal */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Vídeos do Canal
              </h2>
              <a
                href="https://youtube.com/@comunidadecresgate"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 hover:underline font-semibold flex items-center gap-2"
              >
                Ver todos no YouTube
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* Mensagem quando não há vídeos configurados */}
            {VIDEOS_DESTAQUE.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 border border-gray-100 dark:border-gray-700 text-center">
                <FaYoutubeIcon className="h-16 w-16 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Nenhum vídeo configurado
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Para exibir vídeos em destaque aqui, você pode:
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Configure IDs de vídeos específicos no código (veja o arquivo WatchPage.tsx) ou clique no botão abaixo para ir direto ao canal no YouTube
                </p>
                <a
                  href="https://youtube.com/@comunidadecresgate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold transition-colors"
                >
                  <FaYoutubeIcon className="h-5 w-5" />
                  Acessar Canal no YouTube
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {VIDEOS_DESTAQUE.map((videoId) => (
                  <VideoThumbnail
                    key={videoId}
                    videoId={videoId}
                    onSelect={setVideoSelecionado}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Informações do canal */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-xl p-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <FaYoutubeIcon className="h-12 w-12" />
                <div>
                  <h3 className="text-2xl font-bold mb-1">Comunidade Cristã Resgate</h3>
                  <p className="text-red-100">
                    Inscreva-se para não perder nenhuma mensagem
                  </p>
                </div>
              </div>
              <a
                href="https://youtube.com/@comunidadecresgate"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-red-600 hover:bg-red-50 px-8 py-3 rounded-full font-bold transition-colors transform hover:scale-105"
              >
                Visitar Canal
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WatchPage;
