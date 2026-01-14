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
    title: "O Poder da GratidÃ£o",
    content: "A gratidÃ£o transforma o que temos em suficiente, e mais. Ela pode transformar a negaÃ§Ã£o em aceitaÃ§Ã£o, o caos em ordem, a confusÃ£o em clareza. Ela pode transformar uma refeiÃ§Ã£o em um banquete, uma casa em um lar, um estranho em um amigo. A gratidÃ£o dÃ¡ sentido ao nosso passado, traz paz para o hoje e cria uma visÃ£o para o amanhÃ£.",
    verse: "1 Tessalonicenses 5:18",
    author: "ApÃ³stolo Isac"
  },
  {
    title: "Cultivando a ResiliÃªncia",
    content: "ResiliÃªncia nÃ£o Ã© sobre nÃ£o cair, mas sobre a capacidade de se levantar apÃ³s cada queda. Ã‰ a forÃ§a interior que nos permite enfrentar adversidades, aprender com elas e sair mais fortes. Cultive a resiliÃªncia aceitando os desafios como oportunidades de crescimento e mantendo uma perspectiva positiva.",
    verse: "Romanos 8:28",
    author: "ApÃ³stola Elaine"
  },
  {
    title: "A ImportÃ¢ncia da AÃ§Ã£o",
    content: "AÃ§Ã£o Ã© a chave fundamental para todo o sucesso. NÃ£o importa o quÃ£o grande seja a sua ideia ou o quÃ£o bem elaborado seja o seu plano, sem aÃ§Ã£o, nada acontece. Comece pequeno, mas comece. Cada passo, por menor que seja, te aproxima do seu objetivo.",
    verse: "Tiago 2:17",
    author: "Pastor Jadney"
  },
  {
    title: "O Valor do Autoconhecimento",
    content: "Conhecer a si mesmo Ã© o comeÃ§o de toda a sabedoria. Entender suas forÃ§as, fraquezas, paixÃµes e medos Ã© crucial para viver uma vida autÃªntica e com propÃ³sito. Dedique tempo para a reflexÃ£o e a autoanÃ¡lise; isso pavimentarÃ¡ o caminho para o seu crescimento pessoal e espiritual.",
    verse: "ProvÃ©rbios 4:7",
    author: "Pastora Fran"
  },
  {
    title: "Construindo HÃ¡bitos Positivos",
    content: "NÃ³s somos o que fazemos repetidamente. ExcelÃªncia, entÃ£o, nÃ£o Ã© um ato, mas um hÃ¡bito. Pequenas mudanÃ§as consistentes em seus hÃ¡bitos diÃ¡rios podem levar a transformaÃ§Ãµes significativas em sua vida. Comece com um hÃ¡bito que vocÃª deseja desenvolver e pratique-o diariamente atÃ© que se torne parte de quem vocÃª Ã©.",
    verse: "Filipenses 4:8",
    author: "Pastora Kele"
  },
  {
    title: "A ForÃ§a da ComunhÃ£o",
    content: "A comunhÃ£o cristÃ£ Ã© um dos maiores presentes que Deus nos deu. Ã‰ atravÃ©s dela que crescemos, aprendemos e somos fortalecidos na fÃ©. Quando nos reunimos como irmÃ£os e irmÃ£s em Cristo, experimentamos o amor de Deus de forma tangÃ­vel e somos transformados pelo poder do EspÃ­rito Santo.",
    verse: "Hebreus 10:24-25",
    author: "Pastor Leomar"
  },
  {
    title: "Servindo com ExcelÃªncia",
    content: "Servir a Deus nÃ£o Ã© apenas um dever, Ã© um privilÃ©gio. Quando servimos com excelÃªncia, refletimos o carÃ¡ter de Cristo e glorificamos o nome do Senhor. Cada ato de serviÃ§o, por menor que seja, tem valor eterno no reino de Deus.",
    verse: "Colossenses 3:23-24",
    author: "Pastor Elcio"
  },
  {
    title: "A EsperanÃ§a que Transforma",
    content: "A esperanÃ§a cristÃ£ nÃ£o Ã© uma ilusÃ£o, mas uma certeza baseada nas promessas de Deus. Ela nos sustenta nos momentos difÃ­ceis e nos impulsiona a viver com propÃ³sito. Quando temos esperanÃ§a, podemos enfrentar qualquer desafio sabendo que Deus estÃ¡ no controle.",
    verse: "Romanos 15:13",
    author: "Pastora Eneize"
  },
  {
    title: "A Sabedoria que Vem do Alto",
    content: "A sabedoria verdadeira nÃ£o vem do conhecimento humano, mas do temor ao Senhor. Ã‰ uma sabedoria que nos guia em decisÃµes importantes, nos ajuda a discernir entre o certo e o errado, e nos conduz no caminho da vida. Busque esta sabedoria com todo o seu coraÃ§Ã£o.",
    verse: "ProvÃ©rbios 9:10",
    author: "Pastor Thiago"
  },
  {
    title: "O Amor que NÃ£o Falha",
    content: "O amor de Deus Ã© perfeito e nunca falha. Mesmo quando enfrentamos dificuldades, podemos confiar que Ele nos ama incondicionalmente. Este amor nos dÃ¡ forÃ§a para amar outros, mesmo quando Ã© difÃ­cil, e nos capacita a viver uma vida de propÃ³sito e significado.",
    verse: "1 CorÃ­ntios 13:8",
    author: "Pastora Rany"
  },
  {
    title: "ConfianÃ§a InabalÃ¡vel",
    content: "A confianÃ§a em Deus Ã© a base de uma vida estÃ¡vel e pacÃ­fica. Quando nossa mente estÃ¡ firmemente focada em Deus, Ele nos conserva em paz, independentemente das circunstÃ¢ncias externas. Esta confianÃ§a nÃ£o Ã© passiva, mas ativa - Ã© uma escolha diÃ¡ria de depositar nossa fÃ© no Senhor.",
    verse: "IsaÃ­as 26:3",
    author: "Pastor Jadney"
  },
  {
    title: "EsperanÃ§a Renovada",
    content: "Mesmo nos momentos mais sombrios da vida, as misericÃ³rdias de Deus se renovam a cada manhÃ£. Sua fidelidade Ã© grande e constante. Esta verdade nos dÃ¡ esperanÃ§a renovada para cada novo dia, sabendo que Deus estÃ¡ sempre presente e ativo em nossa vida.",
    verse: "LamentaÃ§Ãµes 3:22-23",
    author: "ApÃ³stola Elaine"
  },
  {
    title: "Desperte o Gigante Interior",
    content: "Dentro de cada um de nÃ³s existe um potencial ilimitado que sÃ³ pode ser despertado atravÃ©s da forÃ§a que vem de Cristo. NÃ£o somos limitados por nossas prÃ³prias capacidades, mas sim fortalecidos pelo poder de Deus. Quando reconhecemos nossa dependÃªncia dEle, descobrimos que podemos fazer muito mais do que imaginÃ¡vamos.",
    verse: "Filipenses 4:13",
    author: "Coach CristÃ£o"
  },
  {
    title: "Consolo para o CoraÃ§Ã£o Ferido",
    content: "Deus nÃ£o estÃ¡ distante quando nosso coraÃ§Ã£o estÃ¡ ferido. Ele se aproxima especialmente dos quebrantados e contritos. Sua presenÃ§a Ã© um bÃ¡lsamo para nossa dor, e Sua salvaÃ§Ã£o Ã© nossa esperanÃ§a. Em meio ao sofrimento, podemos encontrar consolo na certeza de que Ele estÃ¡ prÃ³ximo.",
    verse: "Salmo 34:18",
    author: "MinistÃ©rio de ConsolaÃ§Ã£o"
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
        title="Comunidade CristÃ£ Resgate - Um lugar de fÃ©, comunidade e transparÃªncia"
        description="Comunidade CristÃ£ Resgate em BrasÃ­lia-DF. Cultos, estudos bÃ­blicos, ministÃ©rios, cÃ©lulas e muito mais. Venha fazer parte da nossa famÃ­lia!"
        keywords="igreja brasÃ­lia, comunidade cristÃ£ resgate, culto, estudos bÃ­blicos, ministÃ©rios, cÃ©lula, fÃ©, esperanÃ§a, brasÃ­lia df"
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
              alt="Comunidade CristÃ£ Resgate" 
              className="mx-auto h-16 w-16 sm:h-20 sm:w-20 mb-3 sm:mb-4 opacity-90"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-3 sm:mb-4 px-2 fade-in-up stagger-1 leading-tight">
            Bem-vindo Ã  Comunidade CristÃ£ Resgate
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 px-4 fade-in-up stagger-2">
            Um lugar para pertencer, acreditar e se tornar.
          </p>
          <Link 
            to="/sobre" 
            className="inline-block bg-white text-blue-600 hover:bg-gray-100 text-base sm:text-lg font-semibold py-3 px-6 sm:px-8 rounded-lg transition-all duration-300 transform hover:scale-105 fade-in-scale stagger-3 min-h-[48px] flex items-center justify-center"
          >
            Saiba Mais
          </Link>
        </div>
      </div>

      {/* Quick Actions Section - OTIMIZADO PARA MOBILE */}
      <div className="py-8 sm:py-12 md:py-16 bg-white dark:bg-gray-800 bg-waves">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-center mb-6 sm:mb-8 dark:text-white fade-in-up px-2">
            Acesso RÃ¡pido
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Segunda a Sexta: 9h Ã s 18h</p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 text-center">
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                <EnvelopeIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">cresgate012@gmail.com</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Respondemos em atÃ© 24h</p>
            </div>
            
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 text-center">
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                <MapPinIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">EndereÃ§o</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Quadra 38, Ãrea Especial, Lote E<br />Vila SÃ£o JosÃ©, BrasÃ­lia - DF<br />72010-010</p>
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

      {/* HorÃ¡rios de Culto Section */}
      <div className="py-16 bg-white dark:bg-gray-800 bg-waves">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-heading mb-2 dark:text-white">HorÃ¡rios de Culto</h2>
            <p className="text-gray-600 dark:text-gray-300">Venha adorar conosco</p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl shadow-lg p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center">
                    <CalendarIcon className="h-6 w-6 text-blue-600 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Culto de CelebraÃ§Ã£o</h3>
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
                      <h3 className="font-semibold text-gray-900 dark:text-white">CÃ©lula Resgate</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">ComunhÃ£o e crescimento</p>
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
            Pronto para ComeÃ§ar sua Jornada?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto opacity-90 fade-in-up stagger-1 px-2">
            Junte-se Ã  nossa comunidade e descubra o propÃ³sito que Deus tem para sua vida
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
