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
      // Ajustar para timezone local se necessário
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

    const membrosEscalados = escala.membros
      .filter((m) => m.status !== 'substituido')
      .map((m) => `${m.membro_nome} – ${m.funcao}`);

    const membroLinha = membrosEscalados.length > 0
      ? membrosEscalados.join('\n')
      : 'Não informado';

    const message =
      `🎵 ESCALA OFICIAL – ${escala.ministerio_nome}\n\n` +
      `📅 Data: ${date}\n` +
      `🕛 Horário: ${time}\n\n` +
      `👤 Membro Escalado:\n` +
      `⏳ ${membroLinha}\n\n` +
      `⚠️ Sua presença é essencial para o bom andamento do ministério.\n` +
      `Pedimos, por gentileza, que confirme sua presença assim que possível, demonstrando seu compromisso com esta escala.\n\n` +
      `Agradecemos sua disponibilidade e dedicação à obra do Senhor. 🙏\n` +
      `Que Deus abençoe seu serviço!\n\n` +
      `Comunidade Cristã Resgate`;

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
