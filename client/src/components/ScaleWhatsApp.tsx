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
    // Corrigir problema de timezone - usar data local
    let d: Date;
    if (typeof date === 'string') {
      // Se for string no formato YYYY-MM-DD, criar data local
      const [year, month, day] = date.split('T')[0].split('-').map(Number);
      d = new Date(year, month - 1, day);
    } else {
      d = new Date(date);
      // Ajustar para timezone local se necessÃ¡rio
      const offset = d.getTimezoneOffset();
      d = new Date(d.getTime() - (offset * 60 * 1000));
    }
    
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date | string) => {
    // Corrigir problema de timezone
    let d: Date;
    if (typeof date === 'string') {
      const [year, month, day] = date.split('T')[0].split('-').map(Number);
      const timePart = date.includes('T') ? date.split('T')[1] : '00:00';
      const [hours, minutes] = timePart.split(':').map(Number);
      d = new Date(year, month - 1, day, hours || 0, minutes || 0);
    } else {
      d = new Date(date);
    }
    
    return d.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const generateWhatsAppMessage = (): string => {
    const date = formatDate(escala.data);
    const time = formatTime(escala.data);
    
    // Mensagem formatada com negrito e Ã­cones
    let message = `ðŸŽµ *ESCALA - ${escala.ministerio_nome}*\n\n`;
    message += `ðŸ“… *Data:* ${date}\n`;
    message += `ðŸ• *HorÃ¡rio:* ${time}\n\n`;
    message += `ðŸ‘¥ *Membros Escalados:*\n\n`;
    
    escala.membros.forEach((membro, index) => {
      const statusEmoji = membro.status === 'confirmado' ? 'âœ…' : 
                         membro.status === 'substituido' ? 'ðŸ”„' : 
                         membro.status === 'ausente' ? 'âŒ' : 'â³';
      
      // Destacar nome em negrito e funÃ§Ã£o
      message += `${statusEmoji} *${membro.membro_nome}* - ${membro.funcao}\n`;
    });
    
    if (escala.observacoes && escala.observacoes.trim()) {
      message += `\nðŸ“ *ObservaÃ§Ãµes:*\n${escala.observacoes}\n`;
    }
    
    message += `\nâœ… *Confirme sua presenÃ§a no app!*\n\n`;
    message += `_Comunidade CristÃ£ Resgate_`;
    
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
