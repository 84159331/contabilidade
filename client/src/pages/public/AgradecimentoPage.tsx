import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeImage from '../../components/SafeImage';
import SEOHead from '../../components/SEOHead';
import { FaYoutube } from 'react-icons/fa';
import { 
  CheckCircleIcon,
  HomeIcon,
  InformationCircleIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const FaYoutubeIcon = FaYoutube as any;
const YOUTUBE_CHANNEL_URL = 'https://youtube.com/@comunidadecresgate?sub_confirmation=1';

const AgradecimentoPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showRedirect, setShowRedirect] = useState(true);
  
  // Tratamento seguro do state
  let memberName: string | null = null;
  try {
    memberName = (location.state as any)?.memberName || null;
  } catch (error) {
    console.warn('⚠️ Erro ao ler state da navegação:', error);
    memberName = null;
  }

  // Redirecionamento automático após 5 segundos (com opção de cancelar)
  useEffect(() => {
    if (showRedirect) {
      setCountdown(5);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            // Redirecionar para o YouTube
            window.open(YOUTUBE_CHANNEL_URL, '_blank', 'noopener,noreferrer');
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [showRedirect]);

  const handleCancelRedirect = () => {
    setShowRedirect(false);
    setCountdown(null);
  };

  const handleSubscribeNow = () => {
    window.open(YOUTUBE_CHANNEL_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div>
      <SEOHead
        title="Obrigado por se Cadastrar - Comunidade Cristã Resgate"
        description="Agradecemos seu cadastro! Seja bem-vindo à Comunidade Cristã Resgate."
        keywords="agradecimento, cadastro, comunidade cristã resgate"
        url="/cadastro/obrigado"
      />

      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-green-600 to-blue-600 flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/50 to-blue-600/50"></div>
        </div>
        <motion.div 
          className="relative z-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6"
          >
            <div className="mx-auto w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <CheckCircleIcon className="h-16 w-16 text-white" />
            </div>
          </motion.div>
          <motion.h1 
            className="text-5xl font-bold font-heading mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Obrigado por se Cadastrar!
          </motion.h1>
          <motion.p 
            className="text-xl mt-4 opacity-90 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {memberName ? (
              <>Bem-vindo, <strong>{memberName}</strong>! Estamos felizes em tê-lo conosco.</>
            ) : (
              <>Bem-vindo à nossa família! Estamos felizes em tê-lo conosco.</>
            )}
          </motion.p>
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {/* Success Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
                <div className="text-center mb-8">
                  <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                    <HeartIcon className="h-12 w-12 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-3xl font-bold font-heading dark:text-white mb-4">
                    Cadastro Realizado com Sucesso! 🎉
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                    Seus dados foram registrados automaticamente em nosso sistema.
                  </p>
                </div>

                {/* Information Box */}
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
                  <div className="flex items-start space-x-3">
                    <InformationCircleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
                        O que acontece agora?
                      </h3>
                      <ul className="space-y-2 text-blue-800 dark:text-blue-300 text-sm">
                        <li className="flex items-start">
                          <span className="mr-2">✓</span>
                          <span>Você receberá um contato da nossa equipe em breve para dar as boas-vindas</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">✓</span>
                          <span>Seus dados estão seguros e protegidos em nosso sistema</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">✓</span>
                          <span>Você já faz parte da nossa família e comunidade</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* YouTube Subscription Box */}
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 dark:border-red-600 rounded-lg p-6 mb-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="bg-red-600 dark:bg-red-700 p-3 rounded-full">
                        <FaYoutubeIcon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-red-900 dark:text-red-200 mb-1">
                          Inscreva-se no nosso Canal do YouTube
                        </h3>
                        <p className="text-red-800 dark:text-red-300 text-sm">
                          Acompanhe nossas mensagens, cultos e estudos bíblicos
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleSubscribeNow}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg whitespace-nowrap"
                    >
                      <FaYoutubeIcon className="h-5 w-5" />
                      Inscrever-se Agora
                    </button>
                  </div>
                  
                  {/* Countdown para redirecionamento automático */}
                  {showRedirect && countdown !== null && countdown > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 pt-4 border-t border-red-300 dark:border-red-700"
                    >
                      <p className="text-sm text-red-800 dark:text-red-300 text-center">
                        Redirecionando automaticamente em <strong>{countdown}</strong> segundo{countdown !== 1 ? 's' : ''}...
                        <button
                          onClick={handleCancelRedirect}
                          className="ml-2 text-red-600 dark:text-red-400 hover:underline font-semibold"
                        >
                          Cancelar
                        </button>
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => {
                      try {
                        navigate('/');
                      } catch (error) {
                        console.error('❌ Erro ao navegar:', error);
                        window.location.href = '/';
                      }
                    }}
                    className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                  >
                    <HomeIcon className="h-5 w-5 mr-2" />
                    Voltar ao Início
                  </button>
                  <button
                    onClick={() => {
                      try {
                        navigate('/sobre');
                      } catch (error) {
                        console.error('❌ Erro ao navegar:', error);
                        window.location.href = '/sobre';
                      }
                    }}
                    className="flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-700 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-lg font-semibold transition-all transform hover:scale-105 hover:bg-blue-50 dark:hover:bg-gray-600"
                  >
                    Conhecer Mais Sobre Nós
                  </button>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="text-center">
                  <SafeImage 
                    src="/img/ICONE-RESGATE.png" 
                    alt="Comunidade Cristã Resgate" 
                    className="mx-auto h-16 w-16 mb-4 opacity-90"
                  />
                  <h3 className="text-xl font-bold dark:text-white mb-2">
                    Comunidade Cristã Resgate
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Estamos aqui para caminhar juntos nesta jornada de fé e crescimento espiritual.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgradecimentoPage;
