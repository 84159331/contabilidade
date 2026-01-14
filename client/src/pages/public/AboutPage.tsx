import React from 'react';
import { motion } from 'framer-motion';
import SEOHead from '../../components/SEOHead';
import { HeartIcon, UsersIcon, HandRaisedIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const AboutPage: React.FC = () => {
  return (
    <div>
      <SEOHead
        title="Sobre NÃ³s - Comunidade CristÃ£ Resgate"
        description="ConheÃ§a a histÃ³ria, missÃ£o e valores da Comunidade CristÃ£ Resgate. Uma igreja em BrasÃ­lia-DF comprometida com a fÃ©, comunidade e transparÃªncia."
        keywords="sobre, histÃ³ria, missÃ£o, valores, igreja brasÃ­lia, comunidade cristÃ£ resgate"
        url="/sobre"
        type="website"
      />
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center"
        >
          <h1 className="text-5xl font-bold font-heading mb-4">Sobre NÃ³s</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            ConheÃ§a nossa histÃ³ria, missÃ£o e valores que nos guiam como comunidade cristÃ£
          </p>
        </motion.div>
      </div>

      <div className="py-16 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold font-heading mb-4 dark:text-white">Nossa HistÃ³ria</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                A Comunidade CristÃ£ Resgate foi fundada em 1995 com a missÃ£o de ser um farol de esperanÃ§a e fÃ© na comunidade. 
                Desde o inÃ­cio, nosso foco tem sido a adoraÃ§Ã£o a Deus, o ensino da BÃ­blia e o serviÃ§o ao prÃ³ximo.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Ao longo dos anos, crescemos de um pequeno grupo de fiÃ©is para uma comunidade vibrante e diversificada. 
                Nossos membros vÃªm de todas as esferas da vida, unidos por uma fÃ© comum em Jesus Cristo.
              </p>
            </div>
            <div>
              <div className="bg-gray-200 dark:bg-gray-800 h-64 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Imagem da HistÃ³ria</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-16">
            <div>
              <div className="bg-gray-200 dark:bg-gray-800 h-64 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Imagem da MissÃ£o</p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold font-heading mb-4 dark:text-white">Nossa MissÃ£o e VisÃ£o</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Nossa missÃ£o Ã© servir a Deus e Ã  comunidade com amor, dedicaÃ§Ã£o e transparÃªncia em todas as nossas aÃ§Ãµes. 
                Nossa visÃ£o Ã© ser uma igreja que impacta a sociedade atravÃ©s do evangelho, transformando vidas e comunidades.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Acreditamos na importÃ¢ncia da transparÃªncia e da boa gestÃ£o dos recursos que Deus nos confia. 
                Ã‰ por isso que desenvolvemos este sistema de contabilidade, para garantir que cada doaÃ§Ã£o seja 
                administrada com a mÃ¡xima responsabilidade e integridade.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold font-heading mb-4 dark:text-white">Nossos Valores</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                  <HeartIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold font-heading mb-2 dark:text-white">FÃ©</h3>
                <p className="text-gray-600 dark:text-gray-300">Acreditamos no poder de Deus para transformar vidas.</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                  <UsersIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold font-heading mb-2 dark:text-white">Comunidade</h3>
                <p className="text-gray-600 dark:text-gray-300">Crescemos juntos em amor e unidade.</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                  <HandRaisedIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold font-heading mb-2 dark:text-white">ServiÃ§o</h3>
                <p className="text-gray-600 dark:text-gray-300">Servimos uns aos outros e Ã  nossa cidade com alegria.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
