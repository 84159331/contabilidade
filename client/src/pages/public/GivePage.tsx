import React from 'react';
import SafeImage from '../../components/SafeImage';

const GivePage: React.FC = () => {
  return (
    <div className="text-center">
      <div className="mb-6">
        <SafeImage 
          src="/img/ICONE-RESGATE.png" 
          alt="Contribua" 
          className="mx-auto h-16 w-16 mb-4"
        />
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Contribua</h1>
      <p className="text-lg text-gray-600 mb-8">
        Sua generosidade nos ajuda a continuar nosso trabalho na comunidade.
      </p>
    </div>
  );
};

export default GivePage;
