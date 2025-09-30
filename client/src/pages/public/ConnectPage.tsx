import React, { useState, useEffect } from 'react';

const cellGroups = [
  {
    title: 'Grupo Celular - Família',
    description: 'Um grupo para casais e famílias que buscam crescer juntos na fé e no relacionamento.',
    image: '/img/family_placeholder.png'
  },
  {
    title: 'Grupo Celular - Jovens',
    description: 'Conecte-se com outros jovens, discuta temas relevantes e fortaleça sua fé.',
  },
  {
    title: 'Grupo Celular - Mulheres',
    description: 'Um espaço seguro para mulheres compartilharem experiências, orarem e se apoiarem mutuamente.',
  },
  {
    title: 'Grupo Celular - Homens',
    description: 'Homens de fé se reúnem para discutir desafios, buscar sabedoria e fortalecer seu propósito.',
  },
  {
    title: 'Grupo Celular - Novos Convertidos',
    description: 'Ideal para quem está começando sua jornada de fé, com estudos básicos e acolhimento.',
  },
];

const ConnectPage: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold font-heading text-center mb-4">Conecte-se</h1>
      <p className="text-lg text-gray-darkest text-center mb-8">
        Encontre um grupo celular, sirva na igreja e muito mais.
      </p>

      <div className="py-8">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cellGroups.map((group, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {group.image ? (
                    <img 
                      src={group.image} 
                      alt={group.title} 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.parentElement) {
                          e.currentTarget.parentElement.innerHTML = '<div class="bg-gray-200 h-48 flex items-center justify-center"><p class="text-gray-500">Imagem do Grupo</p></div>';
                        }
                      }}
                    />
                  ) : (
                    <div className="bg-gray-200 h-48 flex items-center justify-center">
                      <p className="text-gray-500">Imagem do Grupo</p>
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-2xl font-bold font-heading mb-2">{group.title}</h2>
                    <p className="text-gray-darkest mt-2">{group.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectPage;
