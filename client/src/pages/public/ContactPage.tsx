import React from 'react';
import SafeImage from '../../components/SafeImage';

const ContactPage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <div
        className="relative h-96 bg-cover bg-center flex items-center justify-center text-white"
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center">
          <div className="mb-6">
            <SafeImage 
              src="/img/ICONE-RESGATE.png" 
              alt="Contato" 
              className="mx-auto h-20 w-20 mb-4 opacity-90"
            />
          </div>
          <h1 className="text-5xl font-bold font-heading">Contato</h1>
        </div>
      </div>

      <div className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="mb-6">
                <SafeImage 
                  src="/img/ICONE-RESGATE.png" 
                  alt="Fale Conosco" 
                  className="h-12 w-12 mb-4"
                />
              </div>
              <h2 className="text-3xl font-bold font-heading mb-4">Fale Conosco</h2>
              <form>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-darkest font-medium mb-2">Nome</label>
                  <input type="text" id="name" className="input w-full" placeholder="Seu nome" />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-darkest font-medium mb-2">Email</label>
                  <input type="email" id="email" className="input w-full" placeholder="Seu email" />
                </div>
                <div className="mb-4">
                  <label htmlFor="message" className="block text-gray-darkest font-medium mb-2">Mensagem</label>
                  <textarea id="message" className="input w-full" rows={5} placeholder="Sua mensagem"></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-full">
                  Enviar Mensagem
                </button>
              </form>
            </div>
            <div>
              <div className="mb-6">
                <SafeImage 
                  src="/img/ICONE-RESGATE.png" 
                  alt="Localização" 
                  className="h-12 w-12 mb-4"
                />
              </div>
              <h2 className="text-3xl font-bold font-heading mb-4">Nossa Localização</h2>
              <div className="space-y-4 text-gray-darkest">
                <p>
                  <strong>Endereço:</strong> Quadra 38, Área Especial, Lote E, Vila São José, Brasília - DF, 72010-010
                </p>
                <p>
                  <strong>Telefone:</strong> (11) 1234-5678
                </p>
                <p>
                  <strong>Email:</strong> cresgate012@gmail.com
                </p>
              </div>
              <div className="mt-6">
                <iframe
                  title="Google Maps - Localização da Igreja"
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
      </div>
    </div>
  );
};

export default ContactPage;
