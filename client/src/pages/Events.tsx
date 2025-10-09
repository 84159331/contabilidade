import React, { useState, useEffect } from 'react';
import { PlusIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../firebase/AuthContext';
import { eventsAPI } from '../services/api';
import EventForm from '../components/EventForm';
import EventList from '../components/EventList';
import SocialShare from '../components/SocialShare';
import AutoShareManager from '../components/AutoShareManager';
import { toast } from 'react-toastify';
import { Event, EventFormData } from '../types/Event';

const Events: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventFormData | undefined>();
  const [sharingEvent, setSharingEvent] = useState<Event | undefined>();
  const [autoSharingEvent, setAutoSharingEvent] = useState<Event | undefined>();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      console.log('🔄 Carregando eventos...');
      
      if (!user) {
        console.log('❌ Usuário não autenticado');
        setEvents([]);
        return;
      }

      const eventsData = await eventsAPI.getEvents();
      console.log('✅ Eventos carregados:', eventsData);
      setEvents(eventsData);
    } catch (error) {
      console.error('❌ Erro ao carregar eventos:', error);
      toast.error('Erro ao carregar eventos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    setEditingEvent(undefined);
    setShowForm(true);
  };

  const handleEditEvent = (event: Event) => {
    const eventFormData: EventFormData = {
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      image: event.image,
      social_media: event.social_media
    };
    setEditingEvent(eventFormData);
    setShowForm(true);
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este evento?')) {
      try {
        await eventsAPI.deleteEvent(id);
        toast.success('Evento excluído com sucesso!');
        loadEvents();
      } catch (error) {
        console.error('Erro ao excluir evento:', error);
        toast.error('Erro ao excluir evento');
      }
    }
  };

  const handleSaveEvent = (eventData: EventFormData) => {
    setShowForm(false);
    setEditingEvent(undefined);
    toast.success(editingEvent ? 'Evento atualizado com sucesso!' : 'Evento criado com sucesso!');
    loadEvents();
  };

  const handleShareEvent = (event: Event) => {
    setSharingEvent(event);
  };

  const handleAutoShareEvent = (event: Event) => {
    setAutoSharingEvent(event);
  };

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filter) {
      case 'upcoming':
        return eventDate >= today;
      case 'past':
        return eventDate < today;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <CalendarIcon className="h-6 w-6 mr-2" />
            Eventos
          </h1>
          <p className="text-gray-600">Gerencie os eventos da sua igreja</p>
        </div>
        <button
          onClick={handleCreateEvent}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Novo Evento
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todos ({events.length})
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'upcoming'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Próximos ({events.filter(e => new Date(e.date) >= new Date()).length})
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'past'
                ? 'bg-gray-100 text-gray-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Passados ({events.filter(e => new Date(e.date) < new Date()).length})
          </button>
        </div>
      </div>

      {/* Lista de Eventos */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <EventList
            events={filteredEvents}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
            onShare={handleShareEvent}
            onAutoShare={handleAutoShareEvent}
          />
        </div>
      </div>

      {/* Modal de Formulário */}
      {showForm && (
        <EventForm
          event={editingEvent}
          onClose={() => {
            setShowForm(false);
            setEditingEvent(undefined);
          }}
          onSave={handleSaveEvent}
        />
      )}

      {/* Modal de Compartilhamento */}
      {sharingEvent && (
        <SocialShare
          event={sharingEvent}
          onClose={() => setSharingEvent(undefined)}
        />
      )}

      {/* Modal de Compartilhamento Automático */}
      {autoSharingEvent && (
        <AutoShareManager
          event={autoSharingEvent}
          onClose={() => setAutoSharingEvent(undefined)}
        />
      )}
    </div>
  );
};

export default Events;
