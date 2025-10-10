import React, { useState, useEffect } from 'react';
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon,
  TrashIcon,
  PencilIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { Event } from '../types/Event';
import { eventsAPI } from '../services/api';
import { toast } from 'react-toastify';

interface EventsSectionProps {
  isAdmin?: boolean;
  onEdit?: (event: Event) => void;
  onDelete?: (id: string) => void;
  onShare?: (event: Event) => void;
}

const EventsSection: React.FC<EventsSectionProps> = ({ 
  isAdmin = false, 
  onEdit, 
  onDelete, 
  onShare 
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'this-month'>('upcoming');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      console.log('🔄 Carregando eventos para página inicial...');
      
      // Tentar carregar eventos da API real primeiro
      try {
        const eventsData = await eventsAPI.getEvents();
        if (eventsData && eventsData.length > 0) {
          setEvents(eventsData);
          console.log('✅ Eventos carregados da API:', eventsData.length);
        } else {
          // Fallback para dados mock se não houver eventos na API
          loadMockEvents();
        }
      } catch (apiError) {
        console.log('⚠️ Erro na API, usando dados mock:', apiError);
        loadMockEvents();
      }
      
      setLoading(false);
    } catch (error) {
      console.error('❌ Erro ao carregar eventos:', error);
      setLoading(false);
    }
  };

  const loadMockEvents = () => {
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'Culto de Celebração',
        description: 'Venha celebrar conosco a presença de Deus em nossas vidas',
        date: '2024-01-15',
        time: '19:00',
        location: 'Igreja Comunidade Resgate',
        image: 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Culto+de+Celebração',
        social_media: {
          instagram: true,
          facebook: true,
          whatsapp: true
        },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        title: 'Conferência de Jovens',
        description: 'Um encontro especial para jovens com palestras e atividades',
        date: '2024-01-20',
        time: '14:00',
        location: 'Auditório Principal',
        image: 'https://via.placeholder.com/400x300/059669/FFFFFF?text=Conferência+de+Jovens',
        social_media: {
          instagram: true,
          facebook: false,
          whatsapp: true
        },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '3',
        title: 'Reunião de Oração',
        description: 'Momento especial de oração e comunhão',
        date: '2024-01-25',
        time: '20:00',
        location: 'Sala de Oração',
        image: 'https://via.placeholder.com/400x300/DC2626/FFFFFF?text=Reunião+de+Oração',
        social_media: {
          instagram: false,
          facebook: true,
          whatsapp: true
        },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ];
    setEvents(mockEvents);
    console.log('✅ Eventos mock carregados:', mockEvents.length);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
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

  const isThisMonth = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    return eventDate.getMonth() === today.getMonth() && 
           eventDate.getFullYear() === today.getFullYear();
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este evento?')) {
      try {
        // Se for admin, chamar a função de exclusão passada como prop
        if (isAdmin && onDelete) {
          onDelete(id);
        } else {
          // Para usuários normais, apenas remover da lista local
          setEvents(prev => prev.filter(event => event.id !== id));
          toast.success('Evento removido da visualização!');
        }
        console.log('✅ Evento excluído:', id);
      } catch (error) {
        console.error('❌ Erro ao excluir evento:', error);
        toast.error('Erro ao excluir evento');
      }
    }
  };

  const filteredEvents = events.filter(event => {
    switch (filter) {
      case 'upcoming':
        return isUpcoming(event.date);
      case 'this-month':
        return isThisMonth(event.date);
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando eventos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Próximos Eventos
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Participe dos nossos eventos e fortaleça sua fé junto conosco
          </p>
        </div>

        {/* Filtros */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm p-1">
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'upcoming'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Próximos
            </button>
            <button
              onClick={() => setFilter('this-month')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'this-month'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Este Mês
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Todos
            </button>
          </div>
        </div>

        {/* Lista de Eventos */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhum evento encontrado
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Não há eventos para o filtro selecionado.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Imagem do Evento */}
                {event.image && (
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}

                {/* Conteúdo */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
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
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {event.description}
                    </p>
                  )}

                  {/* Informações do Evento */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      {formatTime(event.time)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      {event.location}
                    </div>
                  </div>

                  {/* Redes Sociais */}
                  {event.social_media && Object.values(event.social_media).some(Boolean) && (
                    <div className="mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Compartilhar:</span>
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

                  {/* Ações para Admin */}
                  {isAdmin && (
                    <div className="flex justify-end space-x-2 pt-4 border-t">
                      {onShare && (
                        <button
                          onClick={() => onShare(event)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <ShareIcon className="h-3 w-3 mr-1" />
                          Compartilhar
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(event)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <PencilIcon className="h-3 w-3 mr-1" />
                          Editar
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50"
                        >
                          <TrashIcon className="h-3 w-3 mr-1" />
                          Excluir
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Quer saber mais sobre nossos eventos?
          </p>
          <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            Entre em Contato
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventsSection;
