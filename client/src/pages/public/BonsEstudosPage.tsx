import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpenIcon, CalendarIcon, ClockIcon, HeartIcon, TagIcon } from '@heroicons/react/24/outline';
import { getEstudoDoDia, Estudo } from '../../services/estudosService';

const BonsEstudosPage: React.FC = () => {
  const [estudoHoje, setEstudoHoje] = useState<Estudo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarEstudoDoDia = async () => {
      try {
        const estudo = await getEstudoDoDia();
        setEstudoHoje(estudo);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Erro ao carregar estudo do dia:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarEstudoDoDia();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando estudo do dia...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <BookOpenIcon className="h-12 w-12 text-primary-600 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
              Bons Estudos
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Alimento diÃ¡rio para sua alma. Estudos bÃ­blicos atualizados todos os dias para fortalecer sua fÃ© e caminhada com Cristo.
          </p>
        </motion.div>

        {/* Estudo do Dia */}
        {estudoHoje && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
              {/* CabeÃ§alho do Estudo */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <CalendarIcon className="h-6 w-6 mr-2" />
                    <span className="text-sm font-medium">
                      {new Date(estudoHoje.data).toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  {estudoHoje.autor && (
                    <div className="text-sm opacity-90">
                      Por {estudoHoje.autor}
                    </div>
                  )}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">
                  {estudoHoje.titulo}
                </h2>
                {estudoHoje.categoria && (
                  <div className="mt-2 flex items-center">
                    <TagIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                      {estudoHoje.categoria}
                    </span>
                  </div>
                )}
              </div>

              {/* ConteÃºdo do Estudo */}
              <div className="p-8 space-y-8">
                {/* VersÃ­culo */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <div className="flex items-start">
                    <HeartIcon className="h-6 w-6 text-red-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                        {estudoHoje.versiculo}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 italic text-lg leading-relaxed">
                        "{estudoHoje.texto}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* ReflexÃ£o */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                    <BookOpenIcon className="h-6 w-6 text-primary-600 mr-2" />
                    ReflexÃ£o
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    {estudoHoje.reflexao}
                  </p>
                </div>

                {/* OraÃ§Ã£o */}
                <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                    <HeartIcon className="h-6 w-6 text-primary-600 mr-2" />
                    OraÃ§Ã£o do Dia
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg italic">
                    {estudoHoje.oracao}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Quer receber os estudos diariamente?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Inscreva-se para receber nosso estudo bÃ­blico diÃ¡rio diretamente no seu e-mail ou WhatsApp.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://www.instagram.com/comunidadecresgate/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Seguir no Instagram
              </a>
              <a
                href="https://youtube.com/@comunidadecresgate"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Inscrever no YouTube
              </a>
            </div>
          </div>
        </motion.div>

        {/* InformaÃ§Ãµes Adicionais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
            <ClockIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
              AtualizaÃ§Ã£o DiÃ¡ria
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Novos estudos todos os dias para fortalecer sua caminhada espiritual.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
            <BookOpenIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
              Base BÃ­blica
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Todos os estudos sÃ£o fundamentados na Palavra de Deus.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
            <HeartIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
              AplicaÃ§Ã£o PrÃ¡tica
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              ReflexÃµes que podem ser aplicadas no seu dia a dia.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BonsEstudosPage;
