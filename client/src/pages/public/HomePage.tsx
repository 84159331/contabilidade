import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SafeImage from '../../components/SafeImage';

const dailyStudies = [
  {
    title: "O Poder da Gratidão",
    content: "A gratidão transforma o que temos em suficiente, e mais. Ela pode transformar a negação em aceitação, o caos em ordem, a confusão em clareza. Ela pode transformar uma refeição em um banquete, uma casa em um lar, um estranho em um amigo. A gratidão dá sentido ao nosso passado, traz paz para o hoje e cria uma visão para o amanhã."
  },
  {
    title: "Cultivando a Resiliência",
    content: "Resiliência não é sobre não cair, mas sobre a capacidade de se levantar após cada queda. É a força interior que nos permite enfrentar adversidades, aprender com elas e sair mais fortes. Cultive a resiliência aceitando os desafios como oportunidades de crescimento e mantendo uma perspectiva positiva."
  },
  {
    title: "A Importância da Ação",
    content: "Ação é a chave fundamental para todo o sucesso. Não importa o quão grande seja a sua ideia ou o quão bem elaborado seja o seu plano, sem ação, nada acontece. Comece pequeno, mas comece. Cada passo, por menor que seja, te aproxima do seu objetivo."
  },
  {
    title: "O Valor do Autoconhecimento",
    content: "Conhecer a si mesmo é o começo de toda a sabedoria. Entender suas forças, fraquezas, paixões e medos é crucial para viver uma vida autêntica e com propósito. Dedique tempo para a reflexão e a autoanálise; isso pavimentará o caminho para o seu crescimento pessoal e espiritual."
  },
  {
    title: "Construindo Hábitos Positivos",
    content: "Nós somos o que fazemos repetidamente. Excelência, então, não é um ato, mas um hábito. Pequenas mudanças consistentes em seus hábitos diários podem levar a transformações significativas em sua vida. Comece com um hábito que você deseja desenvolver e pratique-o diariamente até que se torne parte de quem você é."
  },
];

const HomePage: React.FC = () => {
  const [currentStudyIndex, setCurrentStudyIndex] = useState(0);
  const [showStudy, setShowStudy] = useState(true);
  const [loadingStudy, setLoadingStudy] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setLoadingStudy(false);
    }, 1000);

    const interval = setInterval(() => {
      setShowStudy(false); // Start fade out
      setTimeout(() => {
        setCurrentStudyIndex((prevIndex) => (prevIndex + 1) % dailyStudies.length);
        setShowStudy(true); // Start fade in
      }, 500); // Half second for fade out
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, []);

  const dailyStudy = dailyStudies[currentStudyIndex];

  return (
    <div>
      {/* Hero Section */}
      <div
        className="relative h-screen flex items-center justify-center text-white overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800"
      >
        <div className="absolute inset-0 bg-black opacity-30 z-10"></div>
        <div className="relative z-20 text-center">
          <div className="mb-6">
            <SafeImage 
              src="/img/ICONE-RESGATE.png" 
              alt="Comunidade Cristã Resgate" 
              className="mx-auto h-20 w-20 mb-4 opacity-90"
            />
          </div>
          <h1 className="text-5xl font-bold font-heading mb-4">Bem-vindo à Comunidade Cristã Resgate</h1>
          <p className="text-xl mb-8">Um lugar para pertencer, acreditar e se tornar.</p>
          <Link to="/sobre" className="btn btn-primary text-lg py-3 px-8">
            Saiba Mais
          </Link>
        </div>
      </div>

      {/* Estudo de Hoje Section */}
      <div className="py-16 bg-gray-light">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold font-heading mb-2">Estudo de Hoje</h2>
          {loadingStudy ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue"></div>
            </div>
          ) : (
            <>
              <h3 className={`text-2xl font-bold font-heading mb-4 text-black transition-opacity duration-500 ${showStudy ? 'opacity-100' : 'opacity-0'}`}>{dailyStudy.title}</h3>
              <p className={`text-gray-darkest mb-6 transition-opacity duration-500 ${showStudy ? 'opacity-100' : 'opacity-0'}`}>{dailyStudy.content}</p>
            </>
          )}
        </div>
      </div>

      {/* Around River Valley Section */}
      <div className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold font-heading text-center mb-8">Na Comunidade Cristã Resgate</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <SafeImage 
                src="/img/ICONE-RESGATE.png" 
                alt="Mensagens" 
                className="h-48 w-full object-cover"
                fallbackText="Imagem de Mensagens"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold font-heading mb-2">Mensagens</h3>
                <p className="text-gray-darkest mb-4">Assista às nossas mensagens mais recentes.</p>
                <a href="https://youtube.com/@comunidadecresgate" target="_blank" rel="noopener noreferrer" className="text-blue font-bold hover:underline">Assista Agora</a>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <SafeImage 
                src="/img/ICONE-RESGATE.png" 
                alt="Grupo Celular" 
                className="h-48 w-full object-cover"
                fallbackText="Imagem de Grupo Celular"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold font-heading mb-2">Grupo Celular</h3>
                <p className="text-gray-darkest mb-4">Encontre comunidade e cresça na fé.</p>
                <Link to="/conecte" className="text-blue font-bold hover:underline">Encontre um Grupo</Link>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <SafeImage 
                src="/img/ICONE-RESGATE.png" 
                alt="Eventos" 
                className="h-48 w-full object-cover"
                fallbackText="Imagem de Eventos"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold font-heading mb-2">Eventos</h3>
                <p className="text-gray-darkest mb-4">Veja o que está acontecendo em nossa igreja.</p>
                <Link to="/eventos" className="text-blue font-bold hover:underline">Ver Eventos</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div className="py-16 bg-gray-light">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-6">
            <SafeImage 
              src="/img/LOGO ICONE.png" 
              alt="Comunidade Cristã Resgate" 
              className="mx-auto h-16 w-16 mb-4"
            />
          </div>
          <h2 className="text-3xl font-bold font-heading mb-4">Sobre Nós</h2>
          <p className="max-w-3xl mx-auto text-gray-darkest mb-6">
            A Comunidade Cristã Resgate é uma igreja que ama a Deus e as pessoas. 
            Nossa paixão é ver vidas transformadas pelo poder do Evangelho.
          </p>
          <Link to="/sobre" className="btn btn-secondary text-lg py-3 px-8">
            Nossa História
          </Link>
        </div>
      </div>

      {/* Locations Section */}
      <div className="py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-6">
            <SafeImage 
              src="/img/LOGO ICONE.png" 
              alt="Localização" 
              className="mx-auto h-12 w-12 mb-4"
            />
          </div>
          <h2 className="text-3xl font-bold font-heading mb-4">Nossa Localização</h2>
          <p className="max-w-3xl mx-auto text-gray-darkest mb-6">
            Temos várias localizações para melhor servir você. Encontre a mais próxima!
          </p>
          <Link to="/localizacoes" className="btn btn-primary text-lg py-3 px-8">
            Ver Localização
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
