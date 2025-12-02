import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeImage from '../../components/SafeImage';
import { CalendarIcon, ClockIcon, MapPinIcon, UsersIcon, HeartIcon } from '@heroicons/react/24/outline';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image?: string;
  type: string;
  attendees: number;
  color: string;
}

const events: Event[] = [
  {
    id: 1,
    title: 'Culto de Celebração',
    date: 'Todos os Domingos',
    time: '19:00',
    location: 'Templo Principal',
    description: 'Um tempo de louvor, adoração e ensino da Palavra de Deus.',
    image: '/img/Culto de Celebração - 22-01 [thumb].png',
    type: 'culto',
    attendees: 250,
    color: 'blue'
  },
  {
    id: 2,
    title: 'Estudo Bíblico',
    date: 'Todas as Quartas-feiras',
    time: '19:30 - 21:00',
    location: 'Sala de Estudos',
    description: 'Aprofunde seu conhecimento da Bíblia em nosso estudo semanal.',
    type: 'estudo',
    attendees: 45,
    color: 'green'
  },
  {
    id: 3,
    title: 'Reunião de Oração',
    date: 'Todas as Sextas-feiras',
    time: '07:00 - 08:00',
    location: 'Capela de Oração',
    description: 'Comece o dia com oração e comunhão.',
    type: 'oracao',
    attendees: 30,
    color: 'purple'
  },
  {
    id: 4,
    title: 'Grupo de Jovens',
    date: 'Todos os Sábados',
    time: '18:00 - 20:00',
    location: 'Sala dos Jovens',
    description: 'Um tempo de diversão, comunhão e crescimento para os jovens da nossa igreja.',
    type: 'jovens',
    attendees: 60,
    color: 'orange'
  }
];

const EventsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getTypeLabel = (type: string) => {
    const types = {
      culto: 'Culto',
      estudo: 'Estudo',
      oracao: 'Oração',
      jovens: 'Jovens'
    };
    return types[type as keyof typeof types] || 'Evento';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SafeImage 
              src="/img/ICONE-RESGATE.png" 
              alt="Eventos" 
              className="mx-auto h-16 w-16 mb-6 opacity-90"
            />
            <h1 className="text-5xl font-bold font-heading mb-4">Eventos</h1>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Participe dos nossos eventos e fortaleça sua fé junto conosco
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                <span>{events.length} Eventos Regulares</span>
              </div>
              <div className="flex items-center">
                <UsersIcon className="h-5 w-5 mr-2" />
                <span>Aberto a Todos</span>
              </div>
              <div className="flex items-center">
                <HeartIcon className="h-5 w-5 mr-2" />
                <span>Comunhão e Crescimento</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 dark:border-blue-400"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <SafeImage 
                    src={event.image || '/img/ICONE-RESGATE.png'} 
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    fallbackText="Imagem do Evento"
                    loading={index < 3 ? 'eager' : 'lazy'}
                    priority={index < 3}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  
                  {/* Type Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getColorClasses(event.color)}`}>
                      {getTypeLabel(event.type)}
                    </span>
                  </div>

                  {/* Attendees Count */}
                  <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 px-3 py-1 rounded-full">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                      <UsersIcon className="h-4 w-4 mr-1" />
                      {event.attendees}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold font-heading mb-2 dark:text-white">{event.title}</h2>
                  
                  {/* Event Details */}
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-4">{event.description}</p>

                  {/* Action Button */}
                  <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Participar
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
