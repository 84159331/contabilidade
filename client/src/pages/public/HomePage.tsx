import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SafeImage from '../../components/SafeImage';
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
    author: "Pastor Kele"
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
    author: "Pastor Rany"
  },
];

// Testemunhos - TEMPORARIAMENTE DESABILITADOS
/*
const testimonials = [
  {
    name: "Maria Silva",
    age: 35,
    location: "São Paulo, SP",
    story: "Encontrei na Comunidade Cristã Resgate um lugar onde posso crescer espiritualmente e servir ao próximo. A mensagem de esperança transformou minha vida completamente.",
    image: "/img/testimonial-1.jpg",
    rating: 5
  },
  {
    name: "João Santos",
    age: 28,
    location: "Rio de Janeiro, RJ",
    story: "Os estudos bíblicos e a comunhão com os irmãos me ajudaram a superar momentos difíceis. Hoje sou grato por fazer parte desta família.",
    image: "/img/testimonial-2.jpg",
    rating: 5
  },
  {
    name: "Ana Costa",
    age: 42,
    location: "Brasília, DF",
    story: "A Comunidade Cristã Resgate não é apenas uma igreja, é uma família. Aqui encontrei propósito, amor e uma nova perspectiva de vida.",
    image: "/img/testimonial-3.jpg",
    rating: 5
  }
];
*/

const upcomingEvents = [
  {
    title: "Culto de Celebração",
    date: "15 de Fevereiro",
    time: "19:00",
    location: "Templo Principal",
    description: "Venha celebrar conosco a bondade de Deus em nossas vidas",
    attendees: 234,
    type: "culto"
  },
  {
    title: "Estudo Bíblico - Livro de Efésios",
    date: "20 de Fevereiro",
    time: "20:00",
    location: "Sala de Estudos",
    description: "Estudo profundo sobre a carta de Paulo aos Efésios",
    attendees: 45,
    type: "estudo"
  },
  {
    title: "Conferência de Liderança",
    date: "25 de Fevereiro",
    time: "09:00",
    location: "Auditório",
    description: "Desenvolvendo líderes para o Reino de Deus",
    attendees: 89,
    type: "conferencia"
  }
];

const ministries = [
  {
    name: "Ministério de Louvor",
    description: "Levantamos nossa voz em adoração ao Senhor",
    icon: HeartIcon,
    members: 25,
    leader: "Pastor Kele"
  },
  {
    name: "Ministério Infantil",
    description: "Cuidamos e ensinamos as crianças no caminho do Senhor",
    icon: UsersIcon,
    members: 15,
    leader: "Pastora Fran"
  },
  {
    name: "Ministério de Jovens",
    description: "Conectamos jovens com Cristo e uns com os outros",
    icon: CalendarIcon,
    members: 40,
    leader: "Pastor Jadney"
  },
  {
    name: "Ministério de Ação Social",
    description: "Servimos nossa comunidade com amor e compaixão",
    icon: GiftIcon,
    members: 30,
    leader: "Pastora Eneize"
  },
  {
    name: "Ministério de Ensino",
    description: "Crescimento espiritual através do estudo da Palavra",
    icon: BookOpenIcon,
    members: 20,
    leader: "Pastor Leomar"
  },
  {
    name: "Ministério de Evangelismo",
    description: "Compartilhando o amor de Cristo com o mundo",
    icon: ShareIcon,
    members: 35,
    leader: "Pastor Elcio"
  },
  {
    name: "Ministério de Discipulado",
    description: "Formando discípulos maduros na fé",
    icon: UserGroupIcon,
    members: 28,
    leader: "Pastor Thiago"
  },
  {
    name: "Ministério de Casais",
    description: "Fortalecendo relacionamentos e famílias",
    icon: HeartIcon,
    members: 22,
    leader: "Pastor Rany"
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
    title: "Fazer Contribuição",
    description: "Apoie nossa missão e ministérios",
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

      {/* Quick Actions Section */}
      <div className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold font-heading text-center mb-8 dark:text-white">Acesso Rápido</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className={`${action.color} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
              >
                <div className="text-center">
                  <action.icon className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                  <p className="text-sm opacity-90">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Estudo de Hoje Section */}
      <div className="py-16 bg-gray-200 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-heading mb-2 dark:text-white">Estudo de Hoje</h2>
            <p className="text-gray-600 dark:text-gray-300">Reflexão diária para fortalecer sua fé</p>
          </div>
          
          {loadingStudy ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 dark:border-blue-400"></div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-8">
                <div className="text-center mb-6">
                  <h3 className={`text-2xl font-bold font-heading mb-4 text-gray-900 dark:text-white transition-opacity duration-500 ${showStudy ? 'opacity-100' : 'opacity-0'}`}>
                    {dailyStudy.title}
                  </h3>
                  <p className={`text-gray-600 dark:text-gray-300 mb-4 text-lg leading-relaxed transition-opacity duration-500 ${showStudy ? 'opacity-100' : 'opacity-0'}`}>
                    {dailyStudy.content}
                  </p>
                  <div className={`flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400 transition-opacity duration-500 ${showStudy ? 'opacity-100' : 'opacity-0'}`}>
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
                
                <div className="flex justify-center space-x-4">
                  <Link
                    to="/bons-estudos"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <BookOpenIcon className="h-5 w-5 mr-2" />
                    Mais Estudos
                  </Link>
                  <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors flex items-center">
                    <ShareIcon className="h-5 w-5 mr-2" />
                    Compartilhar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Próximos Eventos Section */}
      <div className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-heading mb-2 dark:text-white">Próximos Eventos</h2>
            <p className="text-gray-600 dark:text-gray-300">Participe dos nossos eventos e fortaleça sua fé</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    event.type === 'culto' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    event.type === 'estudo' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {event.type === 'culto' ? 'Culto' : event.type === 'estudo' ? 'Estudo' : 'Conferência'}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <UsersIcon className="h-4 w-4 mr-1" />
                    {event.attendees}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{event.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{event.description}</p>
                
                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {event.date}
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    {event.time}
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>
                </div>
                
                <Link
                  to="/eventos"
                  className="mt-4 inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  Ver Detalhes
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link
              to="/eventos"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Ver Todos os Eventos
            </Link>
          </div>
        </div>
      </div>

      {/* Ministérios Section */}
      <div className="py-16 bg-gray-200 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-heading mb-2 dark:text-white">Nossos Ministérios</h2>
            <p className="text-gray-600 dark:text-gray-300">Encontre seu lugar de serviço na comunidade</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ministries.map((ministry, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300">
                <div className="mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                    <ministry.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{ministry.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{ministry.description}</p>
                
                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center justify-center">
                    <UsersIcon className="h-4 w-4 mr-1" />
                    {ministry.members} membros
                  </div>
                  <div className="flex items-center justify-center">
                    <StarIcon className="h-4 w-4 mr-1" />
                    Líder: {ministry.leader}
                  </div>
                </div>
                
                <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Participar
                </button>
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
            <h2 className="text-3xl font-bold font-heading mb-2 dark:text-white">Histórias de Transformação</h2>
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
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.age} anos • {testimonial.location}</p>
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
              Faça Parte da Nossa História
            </Link>
          </div>
        </div>
      </div>
      */}


      {/* About Us Section */}
      <div className="py-16 bg-gray-200 dark:bg-gray-800">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-6">
            <SafeImage 
              src="/img/ICONE-RESGATE.png" 
              alt="Comunidade Cristã Resgate" 
              className="mx-auto h-16 w-16 mb-4"
            />
          </div>
          <h2 className="text-3xl font-bold font-heading mb-4 dark:text-white">Sobre Nós</h2>
          <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-300 mb-6">
            A Comunidade Cristã Resgate é uma igreja que ama a Deus e as pessoas. 
            Nossa paixão é ver vidas transformadas pelo poder do Evangelho.
          </p>
          <Link to="/sobre" className="btn btn-secondary text-lg py-3 px-8">
            Nossa História
          </Link>
        </div>
      </div>

      {/* Informações de Contato Section */}
      <div className="py-16 bg-gray-200 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-heading mb-2 dark:text-white">Entre em Contato</h2>
            <p className="text-gray-600 dark:text-gray-300">Estamos aqui para ajudar e responder suas dúvidas</p>
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
      <div className="py-16 bg-white dark:bg-gray-800">
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
                      <h3 className="font-semibold text-gray-900 dark:text-white">Culto Dominical</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Culto principal da semana</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">9h e 19h</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Domingo</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center">
                    <BookOpenIcon className="h-6 w-6 text-green-600 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Estudo Bíblico</h3>
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
                      <h3 className="font-semibold text-gray-900 dark:text-white">Grupos Pequenos</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Comunhão e crescimento</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">19h30</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Sexta-feira</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-blue-600 mr-3" />
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">Culto Especial</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-200">Primeiro domingo de cada mês às 19h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Final */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold font-heading mb-4">Pronto para Começar sua Jornada?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Junte-se à nossa comunidade e descubra o propósito que Deus tem para sua vida
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/conecte"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              Conectar-se
            </Link>
            <Link
              to="/sobre"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              Conhecer Mais
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
