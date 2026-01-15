import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SafeImage from '../../components/SafeImage';
import SEOHead from '../../components/SEOHead';
import EventsSection from '../../components/EventsSection';
import { 
  HeartIcon, 
  BookOpenIcon, 
  UsersIcon, 
  UserGroupIcon,
  CalendarIcon,
  PlayIcon,
  ShareIcon,
  ChatBubbleLeftRightIcon,
  GiftIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  StarIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const dailyStudies = [
  {
    title: "O Poder da Gratidão",
    content: "A gratidão transforma o que temos em suficiente, e mais. Ela pode transformar a negação em aceitação, o caos em ordem, a confusão em clareza. Ela pode transformar uma refeição em um banquete, uma casa em um lar, um estranho em um amigo. A gratidão dá sentido ao nosso passado, traz paz para o hoje e cria uma visão para o amanhã.",
    verse: "1 Tessalonicenses 5:18",
    author: "Apóstolo Isac"
  },
  {
    title: "Cultivando a Resiliência",
    content: "Resiliência não é sobre não cair, mas sobre a capacidade de se levantar após cada queda. É a força interior que nos permite enfrentar adversidades, aprender com elas e sair mais fortes. Cultive a resiliência aceitando os desafios como oportunidades de crescimento e mantendo uma perspectiva positiva.",
    verse: "Romanos 8:28",
    author: "Apóstola Elaine"
  },
  {
    title: "A Importância da Ação",
    content: "Ação é a chave fundamental para todo o sucesso. Não importa o quão grande seja a sua ideia ou o quão bem elaborado seja o seu plano, sem ação, nada acontece. Comece pequeno, mas comece. Cada passo, por menor que seja, te aproxima do seu objetivo.",
    verse: "Tiago 2:17",
    author: "Pastor Jadney"
  },
  {
    title: "O Valor do Autoconhecimento",
    content: "Conhecer a si mesmo é o começo de toda a sabedoria. Entender suas forças, fraquezas, paixões e medos é crucial para viver uma vida autêntica e com propósito. Dedique tempo para a reflexão e a autoanálise; isso pavimentará o caminho para o seu crescimento pessoal e espiritual.",
    verse: "Provérbios 4:7",
    author: "Pastora Fran"
  },
  {
    title: "Construindo Hábitos Positivos",
    content: "Nós somos o que fazemos repetidamente. Excelência, então, não é um ato, mas um hábito. Pequenas mudanças consistentes em seus hábitos diários podem levar a transformações significativas em sua vida. Comece com um hábito que você deseja desenvolver e pratique-o diariamente até que se torne parte de quem você é.",
    verse: "Filipenses 4:8",
    author: "Pastora Kele"
  },
  {
    title: "A Força da Comunhão",
    content: "A comunhão cristã é um dos maiores presentes que Deus nos deu. É através dela que crescemos, aprendemos e somos fortalecidos na fé. Quando nos reunimos como irmãos e irmãs em Cristo, experimentamos o amor de Deus de forma tangível e somos transformados pelo poder do Espírito Santo.",
    verse: "Hebreus 10:24-25",
    author: "Pastor Leomar"
  },
  {
    title: "Servindo com Excelência",
    content: "Servir a Deus não é apenas um dever, é um privilégio. Quando servimos com excelência, refletimos o caráter de Cristo e glorificamos o nome do Senhor. Cada ato de serviço, por menor que seja, tem valor eterno no reino de Deus.",
    verse: "Colossenses 3:23-24",
    author: "Pastor Elcio"
  },
  {
    title: "A Esperança que Transforma",
    content: "A esperança cristã não é uma ilusão, mas uma certeza baseada nas promessas de Deus. Ela nos sustenta nos momentos difíceis e nos impulsiona a viver com propósito. Quando temos esperança, podemos enfrentar qualquer desafio sabendo que Deus está no controle.",
    verse: "Romanos 15:13",
    author: "Pastora Eneize"
  },
  {
    title: "A Sabedoria que Vem do Alto",
    content: "A sabedoria verdadeira não vem do conhecimento humano, mas do temor ao Senhor. É uma sabedoria que nos guia em decisões importantes, nos ajuda a discernir entre o certo e o errado, e nos conduz no caminho da vida. Busque esta sabedoria com todo o seu coração.",
    verse: "Provérbios 9:10",
    author: "Pastor Thiago"
  },
  {
    title: "O Amor que Não Falha",
    content: "O amor de Deus é perfeito e nunca falha. Mesmo quando enfrentamos dificuldades, podemos confiar que Ele nos ama incondicionalmente. Este amor nos dá força para amar outros, mesmo quando é difícil, e nos capacita a viver uma vida de propósito e significado.",
    verse: "1 Coríntios 13:8",
    author: "Pastora Rany"
  },
  {
    title: "Confiança Inabalável",
    content: "A confiança em Deus é a base de uma vida estável e pacífica. Quando nossa mente está firmemente focada em Deus, Ele nos conserva em paz, independentemente das circunstâncias externas. Esta confiança não é passiva, mas ativa - é uma escolha diária de depositar nossa fé no Senhor.",
    verse: "Isaías 26:3",
    author: "Pastor Jadney"
  },
  {
    title: "Esperança Renovada",
    content: "Mesmo nos momentos mais sombrios da vida, as misericórdias de Deus se renovam a cada manhã. Sua fidelidade é grande e constante. Esta verdade nos dá esperança renovada para cada novo dia, sabendo que Deus está sempre presente e ativo em nossa vida.",
    verse: "Lamentações 3:22-23",
    author: "Apóstola Elaine"
  },
  {
    title: "Desperte o Gigante Interior",
    content: "Dentro de cada um de nós existe um potencial ilimitado que só pode ser despertado através da força que vem de Cristo. Não somos limitados por nossas próprias capacidades, mas sim fortalecidos pelo poder de Deus. Quando reconhecemos nossa dependência dEle, descobrimos que podemos fazer muito mais do que imaginávamos.",
    verse: "Filipenses 4:13",
    author: "Coach Cristão"
  },
  {
    title: "Consolo para o Coração Ferido",
    content: "Deus não está distante quando nosso coração está ferido. Ele se aproxima especialmente dos quebrantados e contritos. Sua presença é um bálsamo para nossa dor, e Sua salvação é nossa esperança. Em meio ao sofrimento, podemos encontrar consolo na certeza de que Ele está próximo.",
    verse: "Salmo 34:18",
    author: "Ministério de Consolação"
  },
];

// Testemunhos - TEMPORARIAMENTE DESABILITADOS
/*
const testimonials = [
  {
    name: "Maria Silva",
    age: 35,
    location: "SÃ£o Paulo, SP",
    story: "Encontrei na Comunidade CristÃ£ Resgate um lugar onde posso crescer espiritualmente e servir ao prÃ³ximo. A mensagem de esperanÃ§a transformou minha vida completamente.",
    image: "/img/testimonial-1.jpg",
    rating: 5
  },
  {
    name: "JoÃ£o Santos",
    age: 28,
    location: "Rio de Janeiro, RJ",
    story: "Os estudos bÃ­blicos e a comunhÃ£o com os irmÃ£os me ajudaram a superar momentos difÃ­ceis. Hoje sou grato por fazer parte desta famÃ­lia.",
    image: "/img/testimonial-2.jpg",
    rating: 5
  },
  {
    name: "Ana Costa",
    age: 42,
    location: "BrasÃ­lia, DF",
    story: "A Comunidade CristÃ£ Resgate nÃ£o Ã© apenas uma igreja, Ã© uma famÃ­lia. Aqui encontrei propÃ³sito, amor e uma nova perspectiva de vida.",
    image: "/img/testimonial-3.jpg",
    rating: 5
  }
];
*/

const upcomingEvents = [
  {
    title: "Culto de CelebraÃ§Ã£o",
    date: "15 de Fevereiro",
    time: "19:00",
    location: "Templo Principal",
    description: "Venha celebrar conosco a bondade de Deus em nossas vidas",
    attendees: 234,
    type: "culto"
  },
  {
    title: "Estudo BÃ­blico - Livro de EfÃ©sios",
    date: "20 de Fevereiro",
    time: "20:00",
    location: "Sala de Estudos",
    description: "Estudo profundo sobre a carta de Paulo aos EfÃ©sios",
    attendees: 45,
    type: "estudo"
  },
  {
    title: "ConferÃªncia de LideranÃ§a",
    date: "25 de Fevereiro",
    time: "09:00",
    location: "AuditÃ³rio",
    description: "Desenvolvendo lÃ­deres para o Reino de Deus",
    attendees: 89,
    type: "conferencia"
  }
];

const ministries = [
  {
    name: "MinistÃ©rio de Louvor",
    description: "Levantamos nossa voz em adoraÃ§Ã£o ao Senhor",
    icon: HeartIcon,
    leader: "Pr. Jadney"
  },
  {
    name: "MinistÃ©rio Infantil",
    description: "Cuidamos e ensinamos as crianÃ§as no caminho do Senhor",
    icon: UsersIcon,
    leader: "Pastora Eneiza"
  },
  {
    name: "MinistÃ©rio de Jovens",
    description: "Conectamos jovens com Cristo e uns com os outros",
    icon: CalendarIcon,
    leader: "Prs. Jadney e Kele"
  },
  {
    name: "MinistÃ©rio de AÃ§Ã£o Social",
    description: "Servimos nossa comunidade com amor e compaixÃ£o",
    icon: GiftIcon,
    leader: "Obr. Clebson e Hiully"
  },
  {
    name: "Escola Resgate",
    description: "Crescimento espiritual atravÃ©s do estudo da Palavra",
    icon: BookOpenIcon,
    leader: "ApÃ³stolo Isac e Elaine"
  },
  {
    name: "MinistÃ©rio de Discipulado",
    description: "Formando discÃ­pulos maduros na fÃ©",
    icon: UserGroupIcon,
    leader: "Aps. Isac e Elaine"
  },
  {
    name: "MinistÃ©rio de Casais",
    description: "Fortalecendo relacionamentos e famÃ­lias",
    icon: HeartIcon,
    leader: "Prs. Leomar e OdÃ­lia"
  }
];

const quickActions = [
  {
    title: "Assistir Culto ao Vivo",
    description: "Participe do nosso culto dominical",
    icon: PlayIcon,
    link: "/assista",
    color: "bg-red-600 hover:bg-red-700"
  },
  {
    title: "Biblioteca Digital",
    description: "Acesse estudos e recursos espirituais",
    icon: BookOpenIcon,
    link: "/biblioteca",
    color: "bg-blue-600 hover:bg-blue-700"
  },
  {
    title: "Fazer ContribuiÃ§Ã£o",
    description: "Apoie nossa missÃ£o e ministÃ©rios",
    icon: GiftIcon,
    link: "/contribua",
    color: "bg-green-600 hover:bg-green-700"
  },
  {
    title: "Conectar-se",
    description: "Encontre um grupo pequeno",
    icon: UsersIcon,
    link: "/conecte",
    color: "bg-purple-600 hover:bg-purple-700"
  }
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
    <>
      <SEOHead
        title="Comunidade Cristã Resgate - Um lugar de fé, comunidade e transparência"
        description="Comunidade Cristã Resgate em Brasília-DF. Cultos, estudos bíblicos, ministérios, células e muito mais. Venha fazer parte da nossa família!"
        keywords="igreja brasília, comunidade cristã resgate, culto, estudos bíblicos, ministérios, célula, fé, esperança, brasília df"
        url="/"
        type="website"
      />
      <div>
      {/* Hero Section - OTIMIZADO PARA MOBILE */}
      <div
        className="relative min-h-[60vh] sm:min-h-[70vh] md:h-screen flex items-center justify-center text-white overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 bg-flow bg-particles px-4"
      >
        <div className="absolute inset-0 bg-black opacity-30 z-10"></div>
        <div className="relative z-20 text-center max-w-4xl mx-auto py-8 sm:py-12">
          <div className="mb-4 sm:mb-6 fade-in-up">
            <SafeImage 
              src="/img/ICONE-RESGATE.png" 
              alt="Comunidade Cristã Resgate" 
              className="mx-auto h-16 w-16 sm:h-20 sm:w-20 mb-3 sm:mb-4 opacity-90"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-3 sm:mb-4 px-2 fade-in-up stagger-1 leading-tight">
            Bem-vindo à Comunidade Cristã Resgate
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 px-4 fade-in-up stagger-2">
            Um lugar para pertencer, acreditar e se tornar.
          </p>
        </div>
      </div>

      {/* Quick Actions Section - OTIMIZADO PARA MOBILE */}
      <div className="py-8 sm:py-12 md:py-16 bg-white dark:bg-gray-800 bg-waves">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-center mb-6 sm:mb-8 dark:text-white fade-in-up px-2">
            Acesso Rápido
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className={`${action.color} text-white p-5 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 fade-in-scale min-h-[140px] sm:min-h-[160px] flex flex-col justify-center touch-manipulation`}
              >
                <div className="text-center">
                  <action.icon className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold mb-2 leading-tight">{action.title}</h3>
                  <p className="text-xs sm:text-sm opacity-90 leading-relaxed">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Estudo de Hoje Section - OTIMIZADO PARA MOBILE */}
      <div className="py-8 sm:py-12 md:py-16 bg-gray-200 dark:bg-gray-800 bg-drift">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold font-heading mb-2 dark:text-white fade-in-up">
              Estudo de Hoje
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 fade-in-up stagger-1">
              ReflexÃ£o diÃ¡ria para fortalecer sua fÃ©
            </p>
          </div>
          
          {loadingStudy ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-600 dark:border-blue-400"></div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-5 sm:p-6 md:p-8 fade-in-scale stagger-2">
                <div className="text-center mb-5 sm:mb-6">
                  <h3 className={`text-xl sm:text-2xl font-bold font-heading mb-3 sm:mb-4 text-gray-900 dark:text-white transition-opacity duration-500 leading-tight ${showStudy ? 'opacity-100' : 'opacity-0'}`}>
                    {dailyStudy.title}
                  </h3>
                  <p className={`text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 mb-4 leading-relaxed transition-opacity duration-500 px-2 ${showStudy ? 'opacity-100' : 'opacity-0'}`}>
                    {dailyStudy.content}
                  </p>
                  <div className={`flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-opacity duration-500 ${showStudy ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="flex items-center">
                      <BookOpenIcon className="h-4 w-4 mr-1" />
                      {dailyStudy.verse}
                    </span>
                    <span className="flex items-center">
                      <UsersIcon className="h-4 w-4 mr-1" />
                      {dailyStudy.author}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <Link
                    to="/bons-estudos"
                    className="bg-blue-600 text-white px-5 sm:px-6 py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center min-h-[48px] touch-manipulation"
                  >
                    <BookOpenIcon className="h-5 w-5 mr-2" />
                    Mais Estudos
                  </Link>
                  <button className="border border-blue-600 text-blue-600 px-5 sm:px-6 py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center min-h-[48px] touch-manipulation">
                    <ShareIcon className="h-5 w-5 mr-2" />
                    Compartilhar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PrÃ³ximos Eventos Section */}
      <EventsSection />

      {/* MinistÃ©rios Section - OTIMIZADO PARA MOBILE */}
      <div className="py-8 sm:py-12 md:py-16 bg-gray-200 dark:bg-gray-800 bg-drift">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold font-heading mb-2 dark:text-white fade-in-up">
              Nossos MinistÃ©rios
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 fade-in-up stagger-1">
              Encontre seu lugar de serviÃ§o na comunidade
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {ministries.map((ministry, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-5 sm:p-6 text-center hover:shadow-xl transition-all duration-300 fade-in-scale">
                <div className="mb-3 sm:mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full w-14 h-14 sm:w-16 sm:h-16 mx-auto flex items-center justify-center">
                    <ministry.icon className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 leading-tight">
                  {ministry.name}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 leading-relaxed">
                  {ministry.description}
                </p>
                
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center justify-center">
                    <StarIcon className="h-4 w-4 mr-1" />
                    LÃ­der: {ministry.leader}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testemunhos Section - TEMPORARIAMENTE DESABILITADA */}
      {/* 
      <div className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-heading mb-2 dark:text-white">HistÃ³rias de TransformaÃ§Ã£o</h2>
            <p className="text-gray-600 dark:text-gray-300">Veja como Deus tem transformado vidas em nossa comunidade</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <SafeImage
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                    fallbackText="Foto"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.age} anos â€¢ {testimonial.location}</p>
                  </div>
                </div>
                
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.story}"</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link
              to="/conecte"
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              FaÃ§a Parte da Nossa HistÃ³ria
            </Link>
          </div>
        </div>
      </div>
      */}



      {/* InformaÃ§Ãµes de Contato Section */}
      <div className="py-16 bg-gray-200 dark:bg-gray-800 bg-drift">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-heading mb-2 dark:text-white">Entre em Contato</h2>
            <p className="text-gray-600 dark:text-gray-300">Estamos aqui para ajudar e responder suas dÃºvidas</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 text-center">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                <PhoneIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Telefone</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">(11) 1234-5678</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Segunda a Sexta: 9h às 18h</p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 text-center">
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                <EnvelopeIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">cresgate012@gmail.com</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Respondemos em até 24h</p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 text-center">
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                <MapPinIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Endereço</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Quadra 38, Área Especial, Lote E<br />Vila São José, Brasília - DF<br />72010-010</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Estacionamento gratuito</p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link
              to="/contato"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Fale Conosco
            </Link>
          </div>
        </div>
      </div>

      {/* Horários de Culto Section */}
      <div className="py-16 bg-white dark:bg-gray-800 bg-waves">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-heading mb-2 dark:text-white">Horários de Culto</h2>
            <p className="text-gray-600 dark:text-gray-300">Venha adorar conosco</p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl shadow-lg p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center">
                    <CalendarIcon className="h-6 w-6 text-blue-600 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Culto de Celebração</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Culto principal da semana</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">19h</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Domingo</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center">
                    <BookOpenIcon className="h-6 w-6 text-green-600 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Escola Resgate</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Crescimento espiritual</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">20h</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Quarta-feira</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center">
                    <UsersIcon className="h-6 w-6 text-purple-600 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Célula Resgate</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Comunhão e crescimento</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">20h</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Quarta-feira</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Final - OTIMIZADO PARA MOBILE */}
      <div className="py-8 sm:py-12 md:py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white bg-flow bg-particles">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading mb-3 sm:mb-4 fade-in-up leading-tight px-2">
            Pronto para Começar sua Jornada?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto opacity-90 fade-in-up stagger-1 px-2">
            Junte-se à nossa comunidade e descubra o propósito que Deus tem para sua vida
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to="/conecte"
              className="bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 fade-in-scale stagger-2 min-h-[48px] flex items-center justify-center touch-manipulation"
            >
              Conectar-se
            </Link>
            <Link
              to="/sobre"
              className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 fade-in-scale stagger-3 min-h-[48px] flex items-center justify-center touch-manipulation"
            >
              Conhecer Mais
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default HomePage;
