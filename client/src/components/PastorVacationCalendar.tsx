import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/Calendar.css';
import { usePastorVacationData } from '../hooks/usePastorVacationData';
import LoadingSpinner from './LoadingSpinner';
import Modal from './Modal';
import * as HeroIcons from '@heroicons/react/24/outline';
import { VacationEvent } from '../services/pastorVacationAPI';

const TrashIcon = HeroIcons.TrashIcon;

const localizer = momentLocalizer(moment);

const PastorVacationCalendar: React.FC = () => {
  const { vacations, loading, error, deleteVacation } = usePastorVacationData();
  const [selectedEvent, setSelectedEvent] = useState<VacationEvent | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSelectEvent = (event: VacationEvent) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (selectedEvent) {
      await deleteVacation(selectedEvent.id);
      setShowDeleteModal(false);
      setSelectedEvent(null);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <>
    <div style={{ height: 500 }}>
      <Calendar
        localizer={localizer}
        events={vacations}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
          onSelectEvent={handleSelectEvent}
        messages={{
          next: "Próximo",
          previous: "Anterior",
          today: "Hoje",
          month: "Mês",
          week: "Semana",
          day: "Dia",
          agenda: "Agenda",
          date: "Data",
          time: "Hora",
          event: "Evento",
          noEventsInRange: "Não há eventos neste período.",
          showMore: total => `+ Ver mais (${total})`
        }}
        eventPropGetter={(event) => {
            const typedEvent = event as any;
          const newTitle = typedEvent.pastorName ? `${typedEvent.title} (${typedEvent.pastorName})` : typedEvent.title;
          return {
            title: newTitle,
              className: 'custom-event-class cursor-pointer',
          };
        }}
      />
    </div>

      <Modal 
        isOpen={showDeleteModal} 
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedEvent(null);
        }} 
        title="Remover Férias"
      >
        {selectedEvent && (
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Deseja remover as férias de <strong>{selectedEvent.pastorName || selectedEvent.title}</strong>?
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Período: {moment(selectedEvent.start).format('DD/MM/YYYY')} até {moment(selectedEvent.end).format('DD/MM/YYYY')}
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedEvent(null);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center gap-2"
              >
                <TrashIcon className="h-4 w-4" />
                Remover
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default PastorVacationCalendar;
