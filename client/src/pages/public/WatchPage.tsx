import React from 'react';

const WatchPage: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Assista</h1>
      <p className="text-lg text-gray-600 mb-8">
        Assista às nossas mensagens mais recentes a qualquer hora, em qualquer lugar.
      </p>
      <a href="http://youtube.com/@comunidadecresgate" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-blue hover:text-blue-dark">
        <img src="/img/youtube.svg" alt="YouTube" className="h-12 w-12 mx-auto" />
        <span className="block text-sm font-medium mt-2">Ir para o YouTube</span>
      </a>
    </div>
  );
};

export default WatchPage;
