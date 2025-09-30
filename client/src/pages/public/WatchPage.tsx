import React from 'react';
import { FaYoutube } from 'react-icons/fa';
import SafeImage from '../../components/SafeImage';

const FaYoutubeIcon = FaYoutube as any;

const WatchPage: React.FC = () => {
  return (
    <div className="text-center">
      <div className="mb-6">
        <SafeImage 
          src="/img/ICONE-RESGATE.png" 
          alt="Assista" 
          className="mx-auto h-16 w-16 mb-4"
        />
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Assista</h1>
      <p className="text-lg text-gray-600 mb-8">
        Assista às nossas mensagens mais recentes a qualquer hora, em qualquer lugar.
      </p>
      <a href="https://youtube.com/@comunidadecresgate" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-red-600 hover:text-red-700 transition-colors">
        <FaYoutubeIcon className="h-16 w-16 mx-auto" />
        <span className="block text-sm font-medium mt-2">Ir para o YouTube</span>
      </a>
    </div>
  );
};

export default WatchPage;
