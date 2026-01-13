// Componente para compartilhar escala via WhatsApp
import React from 'react';
import { ShareIcon } from '@heroicons/react/24/outline';
import type { Escala } from '../types/Scale';

interface ScaleWhatsAppProps {
  escala: Escala;
  className?: string;
}

export const ScaleWhatsApp: React.FC<ScaleWhatsAppProps> = ({ escala, className = '' }) => {
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const generateWhatsAppMessage = (): string => {
    const date = formatDate(escala.data);
    const time = formatTime(escala.data);
    
    let message = `🎵 *ESCALA - ${escala.ministerio_nome}*\n\n`;
    message += `📅 ${date} às ${time}\n\n`;
    message += `👥 *Membros Escalados:*\n`;
    
    escala.membros.forEach((membro, index) => {
      const statusEmoji = membro.status === 'confirmado' ? '✅' : 
                         membro.status === 'substituido' ? '🔄' : 
                         membro.status === 'ausente' ? '❌' : '⏳';
      message += `${statusEmoji} ${membro.membro_nome} - ${membro.funcao}\n`;
    });
    
    if (escala.observacoes) {
      message += `\n📝 *Observações:*\n${escala.observacoes}\n`;
    }
    
    message += `\n✅ Confirme sua presença no app!`;
    
    return message;
  };

  const handleShare = () => {
    const message = generateWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleShare}
      className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-xs sm:text-sm ${className}`}
      title="Compartilhar escala via WhatsApp"
    >
      <ShareIcon className="h-4 w-4 sm:h-5 sm:w-5" />
      <span className="hidden sm:inline">Compartilhar no WhatsApp</span>
      <span className="sm:hidden">WhatsApp</span>
    </button>
  );
};

export default ScaleWhatsApp;
