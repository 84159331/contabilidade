import React from 'react';
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon, 
  PencilIcon,
  TrashIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { Event } from '../types/Event';

interface EventListProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
  onShare: (event: Event) => void;
  onAutoShare?: (event: Event) => void;
}

const EventList: React.FC<EventListProps> = ({ events, onEdit, onDelete, onShare, onAutoShare }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const isUpcoming = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum evento encontrado</h3>
        <p className="mt-1 text-sm text-gray-500">
          Comece criando um novo evento para sua igreja.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {events.map((event) => (
        <div
          key={event.id}
          className={`bg-white rounded-lg shadow-md overflow-hidden ${
            isUpcoming(event.date) ? 'border-l-4 border-green-500' : 'border-l-4 border-gray-300'
          }`}
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {event.title}
                  </h3>
                  {isUpcoming(event.date) && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Próximo
                    </span>
                  )}
                </div>
                
                {event.description && (
                  <p className="text-gray-600 mb-4">{event.description}</p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {formatTime(event.time)}
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {event.location}
                  </div>
                </div>

                {/* Redes Sociais */}
                {event.social_media && Object.values(event.social_media).some(Boolean) && (
                  <div className="mt-3 flex items-center space-x-2">
                    <ShareIcon className="h-4 w-4 text-gray-400" />
                    <div className="flex space-x-2">
                      {event.social_media.instagram && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-pink-100 text-pink-800">
                          Instagram
                        </span>
                      )}
                      {event.social_media.facebook && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          Facebook
                        </span>
                      )}
                      {event.social_media.whatsapp && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                          WhatsApp
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Imagem do evento */}
              {event.image && (
                <div className="ml-4">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Ações */}
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => onShare(event)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
              >
                <ShareIcon className="h-3 w-3 mr-1" />
                Compartilhar
              </button>
              {onAutoShare && (
                <button
                  onClick={() => onAutoShare(event)}
                  className="inline-flex items-center px-3 py-1.5 border border-blue-300 shadow-sm text-xs font-medium rounded text-blue-700 bg-white hover:bg-blue-50"
                >
                  <ClockIcon className="h-3 w-3 mr-1" />
                  Auto Share
                </button>
              )}
              <button
                onClick={() => onEdit(event)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
              >
                <PencilIcon className="h-3 w-3 mr-1" />
                Editar
              </button>
              <button
                onClick={() => onDelete(event.id)}
                className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50"
              >
                <TrashIcon className="h-3 w-3 mr-1" />
                Excluir
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;
