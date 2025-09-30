import React from 'react';
import SafeImage from '../../components/SafeImage';

const LocationsPage: React.FC = () => {
  return (
    <div className="py-16">
      <div className="container mx-auto px-6 text-center">
        <div className="mb-6">
          <SafeImage 
            src="/img/ICONE-RESGATE.png" 
            alt="Localização" 
            className="mx-auto h-16 w-16 mb-4"
          />
        </div>
        <h1 className="text-4xl font-bold font-heading mb-4">Nossa Localização</h1>
        <p className="text-lg text-gray-darkest mb-8">
          Encontre-nos e venha nos visitar!
        </p>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="mb-4">
            <SafeImage 
              src="/img/LOGO ICONE.png" 
              alt="Sede" 
              className="mx-auto h-12 w-12 mb-4"
            />
          </div>
          <h2 className="text-2xl font-bold font-heading mb-4">Comunidade Cristã Resgate - Sede</h2>
          <p className="text-gray-darkest mb-4">
            <strong>Endereço:</strong> Quadra 38, Área Especial, Lote E, Vila São José, Brasília - DF, 72010-010
          </p>
          <p className="text-gray-darkest mb-4">
            <strong>Telefone:</strong> (11) 1234-5678
          </p>
          <p className="text-gray-darkest mb-6">
            <strong>Email:</strong> cresgate012@gmail.com
          </p>
          <div className="mt-6">
            <iframe
              title="Google Maps - Comunidade Cristã Resgate"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3839.0000000000005!2d-47.99999999999999!3d-15.999999999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a2e0000000001%3A0x6f3cb501ba6f6d1!2sComunidade+Crist%C3%A3+Resgate!5e0!3m2!1spt-BR!2sbr!4v1678886434038!5m2!1spt-BR!2sbr"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationsPage;
