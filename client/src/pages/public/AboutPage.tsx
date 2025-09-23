import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <div
        className="relative h-96 bg-cover bg-center flex items-center justify-center text-white"
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold font-heading">Sobre Nós</h1>
        </div>
      </div>

      <div className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold font-heading mb-4">Nossa História</h2>
              <p className="text-gray-darkest mb-4">
                A Comunidade Cristã Resgate foi fundada em 1995 com a missão de ser um farol de esperança e fé na comunidade. 
                Desde o início, nosso foco tem sido a adoração a Deus, o ensino da Bíblia e o serviço ao próximo.
              </p>
              <p className="text-gray-darkest">
                Ao longo dos anos, crescemos de um pequeno grupo de fiéis para uma comunidade vibrante e diversificada. 
                Nossos membros vêm de todas as esferas da vida, unidos por uma fé comum em Jesus Cristo.
              </p>
            </div>
            <div>
              <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Imagem da História</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-16">
            <div>
              <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Imagem da Missão</p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold font-heading mb-4">Nossa Missão e Visão</h2>
              <p className="text-gray-darkest mb-4">
                Nossa missão é servir a Deus e à comunidade com amor, dedicação e transparência em todas as nossas ações. 
                Nossa visão é ser uma igreja que impacta a sociedade através do evangelho, transformando vidas e comunidades.
              </p>
              <p className="text-gray-darkest">
                Acreditamos na importância da transparência e da boa gestão dos recursos que Deus nos confia. 
                É por isso que desenvolvemos este sistema de contabilidade, para garantir que cada doação seja 
                administrada com a máxima responsabilidade e integridade.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold font-heading mb-4">Nossos Valores</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6">
                <h3 className="text-xl font-bold font-heading mb-2">Fé</h3>
                <p className="text-gray-darkest">Acreditamos no poder de Deus para transformar vidas.</p>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold font-heading mb-2">Comunidade</h3>
                <p className="text-gray-darkest">Crescemos juntos em amor e unidade.</p>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold font-heading mb-2">Serviço</h3>
                <p className="text-gray-darkest">Servimos uns aos outros e à nossa cidade com alegria.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
