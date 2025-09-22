import React from 'react';

const events = [
  {
    title: 'Culto de Domingo',
    date: 'Todos os Domingos',
    time: '10:00 - 12:00',
    description: 'Um tempo de louvor, adoração e ensino da Palavra de Deus.',
    image: '/img/Culto de Celebração - 22-01 [thumb].png'
  },
  {
    title: 'Estudo Bíblico',
    date: 'Todas as Quartas-feiras',
    time: '19:30 - 21:00',
    description: 'Aprofunde seu conhecimento da Bíblia em nosso estudo semanal.',
    image: 'https://via.placeholder.com/800x600'
  },
  {
    title: 'Reunião de Oração',
    date: 'Todas as Sextas-feiras',
    time: '07:00 - 08:00',
    description: 'Comece o dia com oração e comunhão.',
    image: 'https://via.placeholder.com/800x600'
  },
  {
    title: 'Grupo de Jovens',
    date: 'Todos os Sábados',
    time: '18:00 - 20:00',
    description: 'Um tempo de diversão, comunhão e crescimento para os jovens da nossa igreja.',
    image: 'https://via.placeholder.com/800x600'
  }
];

const EventsPage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <div
        className="relative h-96 bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: 'url(https://via.placeholder.com/1920x400)' }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold font-heading">Eventos</h1>
        </div>
      </div>

      <div className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h2 className="text-2xl font-bold font-heading mb-2">{event.title}</h2>
                  <p className="text-gray-darkest font-semibold">{event.date} às {event.time}</p>
                  <p className="text-gray-darkest mt-2">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
