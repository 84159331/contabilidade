import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/Calendar.css';
import { usePastorVacationData } from '../hooks/usePastorVacationData';
import LoadingSpinner from './LoadingSpinner';

const localizer = momentLocalizer(moment);

const PastorVacationCalendar: React.FC = () => {
  const { vacations, loading, error } = usePastorVacationData();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div style={{ height: 500 }}>
      <Calendar
        localizer={localizer}
        events={vacations}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
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
          const typedEvent = event as any; // Cast to any to access pastorName
          const newTitle = typedEvent.pastorName ? `${typedEvent.title} (${typedEvent.pastorName})` : typedEvent.title;
          return {
            title: newTitle,
            className: 'custom-event-class', // You can add custom classes here
          };
        }}
      />
    </div>
  );
};

export default PastorVacationCalendar;
