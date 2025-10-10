import React, { useState } from 'react';
import { 
  ShareIcon,
  PhotoIcon,
  LinkIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Event } from '../types/Event';
import SafeImage from './SafeImage';

interface SocialShareProps {
  event: Event;
  onClose: () => void;
}

const SocialShare: React.FC<SocialShareProps> = ({ event, onClose }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [customMessage, setCustomMessage] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  const platforms = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: '📷',
      color: 'bg-pink-500',
      description: 'Compartilhar no Instagram Stories'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: '👥',
      color: 'bg-blue-600',
      description: 'Publicar no Facebook'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: '💬',
      color: 'bg-green-500',
      description: 'Enviar para grupos do WhatsApp'
    }
  ];

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const generateShareText = () => {
    const date = new Date(event.date).toLocaleDateString('pt-BR');
    const defaultMessage = `🎉 ${event.title}\n\n📅 ${date} às ${event.time}\n📍 ${event.location}\n\n${event.description || ''}\n\n#IgrejaComunidadeResgate #Evento`;
    
    return customMessage || defaultMessage;
  };

  const handleShare = async () => {
    if (selectedPlatforms.length === 0) {
      alert('Selecione pelo menos uma plataforma para compartilhar');
      return;
    }

    setIsSharing(true);
    const shareText = generateShareText();

    try {
      for (const platform of selectedPlatforms) {
        await shareToPlatform(platform, shareText);
      }
      
      // Simular delay para mostrar feedback
      setTimeout(() => {
        setIsSharing(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      setIsSharing(false);
    }
  };

  const shareToPlatform = async (platform: string, text: string) => {
    switch (platform) {
      case 'instagram':
        // Para Instagram, abrir o app ou web
        const instagramUrl = `https://www.instagram.com/create/story/`;
        window.open(instagramUrl, '_blank');
        break;
      
      case 'facebook':
        // Para Facebook, usar a API de compartilhamento
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(text)}`;
        window.open(facebookUrl, '_blank');
        break;
      
      case 'whatsapp':
        // Para WhatsApp, usar o link direto
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
        break;
      
      default:
        // Fallback para Web Share API
        if (navigator.share) {
          await navigator.share({
            title: event.title,
            text: text,
            url: window.location.origin
          });
        } else {
          // Copiar para clipboard
          await navigator.clipboard.writeText(text);
        }
    }
  };

  const copyToClipboard = async () => {
    const shareText = generateShareText();
    await navigator.clipboard.writeText(shareText);
    alert('Texto copiado para a área de transferência!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <ShareIcon className="h-5 w-5 mr-2" />
            Compartilhar Evento
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Preview do Evento */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>📅 {new Date(event.date).toLocaleDateString('pt-BR')} às {event.time}</p>
              <p>📍 {event.location}</p>
              {event.description && <p>{event.description}</p>}
            </div>
            {event.image && (
              <SafeImage
                src={event.image}
                alt={event.title}
                className="mt-3 w-full h-32 object-cover rounded"
                fallbackText="Imagem do Evento"
              />
            )}
          </div>

          {/* Mensagem Personalizada */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensagem Personalizada (opcional)
            </label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Personalize a mensagem que será compartilhada..."
            />
          </div>

          {/* Plataformas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Escolha as plataformas:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedPlatforms.includes(platform.id)
                      ? `${platform.color} text-white border-transparent`
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{platform.icon}</div>
                    <div className="font-medium">{platform.name}</div>
                    <div className="text-xs opacity-75 mt-1">
                      {platform.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Preview da Mensagem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview da Mensagem:
            </label>
            <div className="bg-gray-100 rounded-lg p-3 text-sm whitespace-pre-wrap">
              {generateShareText()}
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-between pt-4 border-t">
            <button
              onClick={copyToClipboard}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              Copiar Texto
            </button>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleShare}
                disabled={isSharing || selectedPlatforms.length === 0}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSharing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Compartilhando...
                  </>
                ) : (
                  <>
                    <ShareIcon className="h-4 w-4 mr-2" />
                    Compartilhar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialShare;
