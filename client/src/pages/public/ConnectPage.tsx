import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeImage from '../../components/SafeImage';
import PerfectFillImage from '../../components/PerfectFillImage';
import { 
  UserGroupIcon,
  HeartIcon,
  AcademicCapIcon,
  SparklesIcon,
  HomeIcon,
  CalendarIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  UsersIcon,
  ClockIcon,
  StarIcon,
  ArrowRightIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

interface PublicCellGroup {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  icon: string;
  color: string;
  members: number;
  meetings: string;
  location: string;
  leader: string;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  maxMembers: number;
}

const ConnectPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [cellGroups, setCellGroups] = useState<PublicCellGroup[]>([]);

  // Carregar grupos celulares do localStorage (sincronizado com a tesouraria)
  useEffect(() => {
    const loadCellGroups = () => {
      // Limpar dados antigos que possam ter horários incorretos
      const clearOldData = () => {
        const savedGroups = localStorage.getItem('publicCellGroups');
        if (savedGroups) {
          try {
            const groups = JSON.parse(savedGroups);
            // Verificar se algum grupo tem horário antigo
            const hasOldSchedule = groups.some((group: PublicCellGroup) => 
              group.meetings && !group.meetings.includes('Quarta-Feira 20:00hrs')
            );
            
            if (hasOldSchedule) {
              console.log('🔄 Detectados horários antigos na página pública, atualizando...');
              localStorage.removeItem('publicCellGroups');
              localStorage.removeItem('cellGroups');
              localStorage.removeItem('cellGroupsLastSync');
              return true; // Indica que dados foram limpos
            }
          } catch (error) {
            // Se houver erro ao parsear, limpar dados
            localStorage.removeItem('publicCellGroups');
            return true;
          }
        }
        return false;
      };

      const dataCleared = clearOldData();
      
      const savedGroups = localStorage.getItem('publicCellGroups');
      if (savedGroups) {
        try {
          const groups = JSON.parse(savedGroups);
          // Atualizar horários para garantir que sejam "Quarta-Feira 20:00hrs"
          const updatedGroups = groups.map((group: PublicCellGroup) => ({
            ...group,
            meetings: 'Quarta-Feira 20:00hrs',
            features: [] // Garantir que features esteja vazio
          }));
          // Filtrar apenas grupos ativos
          const activeGroups = updatedGroups.filter((group: PublicCellGroup) => group.isActive);
          setCellGroups(activeGroups);
        } catch (error) {
          // Fallback para grupos padrão se houver erro
          setCellGroups(getDefaultGroups());
        }
      } else {
        // Se não há dados salvos, usar grupos padrão
        setCellGroups(getDefaultGroups());
      }
      setLoading(false);
    };

    loadCellGroups();
  }, []);

  // Grupos padrão caso não haja dados salvos
  const getDefaultGroups = (): PublicCellGroup[] => [
    {
      id: 'family',
      title: 'Célula Resgate Veredas',
      subtitle: 'Crescendo Juntos',
      description: 'Um grupo para casais e famílias que buscam crescer juntos na fé e no relacionamento.',
      image: '/img/family-group.jpg',
      icon: 'HomeIcon',
      color: 'blue',
      members: 0,
      meetings: 'Quarta-Feira 20:00hrs',
      location: '',
      leader: '',
      features: [],
      isPopular: true,
      isActive: true,
      maxMembers: 15
    },
    {
      id: 'youth',
      title: 'Célula Resgate Vendinha',
      subtitle: 'Geração de Impacto',
      description: 'Conecte-se com outros jovens, discuta temas relevantes e fortaleça sua fé.',
      image: '/img/youth-group.jpg',
      icon: 'SparklesIcon',
      color: 'blue',
      members: 0,
      meetings: 'Quarta-Feira 20:00hrs',
      location: '',
      leader: '',
      features: [],
      isPopular: true,
      isActive: true,
      maxMembers: 20
    },
    {
      id: 'women',
      title: 'Célula Resgate Quadra 45',
      subtitle: 'Mulheres de Fé',
      description: 'Um espaço seguro para mulheres compartilharem experiências, orarem e se apoiarem mutuamente.',
      image: '/img/women-group.jpg',
      icon: 'HeartIcon',
      color: 'green',
      members: 0,
      meetings: 'Quarta-Feira 20:00hrs',
      location: '',
      leader: '',
      features: [],
      isPopular: false,
      isActive: true,
      maxMembers: 12
    },
    {
      id: 'men',
      title: 'Célula Resgate Quadra 34',
      subtitle: 'Homens de Propósito',
      description: 'Homens de fé se reúnem para discutir desafios, buscar sabedoria e fortalecer seu propósito.',
      image: '/img/men-group.jpg',
      icon: 'UserGroupIcon',
      color: 'green',
      members: 0,
      meetings: 'Quarta-Feira 20:00hrs',
      location: '',
      leader: '',
      features: [],
      isPopular: false,
      isActive: true,
      maxMembers: 15
    }
  ];

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      HomeIcon,
      SparklesIcon,
      HeartIcon,
      UserGroupIcon,
      AcademicCapIcon,
      BookOpenIcon
    };
    return icons[iconName] || UserGroupIcon;
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-500',
        light: 'bg-blue-50 dark:bg-blue-900',
        text: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-700'
      },
      green: {
        bg: 'bg-green-500',
        light: 'bg-green-50 dark:bg-green-900',
        text: 'text-green-600 dark:text-green-400',
        border: 'border-green-200 dark:border-green-700'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const handleJoinGroup = (groupId: string) => {
    setSelectedGroup(groupId);
    // Simular processo de inscrição
    setTimeout(() => {
      alert('Inscrição realizada com sucesso! Você receberá um contato em breve.');
      setSelectedGroup(null);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Carregando grupos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SafeImage 
              src="/img/ICONE-RESGATE.png" 
              alt="Conecte-se" 
              className="mx-auto h-16 w-16 mb-6 opacity-90"
            />
            <h1 className="text-5xl font-bold font-heading mb-4">Células Resgate</h1>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Encontre seu lugar na família de Deus. Participe de uma célula e cresça junto conosco.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center">
                <UsersIcon className="h-5 w-5 mr-2" />
                <span>{cellGroups.length} Células Disponíveis</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                <span>Reuniões Semanais</span>
              </div>
              <div className="flex items-center">
                <HeartIcon className="h-5 w-5 mr-2" />
                <span>Acolhimento Garantido</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
                   <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                     Escolha Sua Célula
                   </h2>
                   <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                     Cada célula tem sua identidade única, mas todas compartilham o mesmo objetivo: 
                     crescer na fé e construir relacionamentos significativos.
                   </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cellGroups.map((group) => {
            const colors = getColorClasses(group.color);
            const IconComponent = getIconComponent(group.icon);
            
            return (
              <div 
                key={group.id} 
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${group.isPopular ? 'ring-2 ring-blue-500' : ''}`}
              >
                {/* Popular Badge */}
                {group.isPopular && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                      <StarIcon className="h-4 w-4 mr-1" />
                      Popular
                    </span>
                  </div>
                )}

                {/* Image */}
                <div className="relative overflow-hidden">
                  <PerfectFillImage 
                    src={group.image} 
                    alt={group.title}
                    className="w-full"
                    containerHeight={192}
                    fallbackText="Imagem da Célula"
                    borderRadius="rounded-t-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  
                  {/* Icon Overlay */}
                  <div className="absolute top-4 left-4">
                    <div className={`${colors.bg} p-3 rounded-full`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  {/* Members Count */}
                  <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 px-3 py-1 rounded-full">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      Célula Ativa
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {group.title}
                    </h3>
                    <p className={`text-sm font-semibold ${colors.text}`}>
                      {group.subtitle}
                    </p>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                    {group.description}
                  </p>

                  {/* Group Info */}
                  <div className={`${colors.light} rounded-lg p-4 mb-4`}>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <ClockIcon className={`h-4 w-4 mr-2 ${colors.text}`} />
                        <span className="text-gray-700 dark:text-gray-300">{group.meetings}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPinIcon className={`h-4 w-4 mr-2 ${colors.text}`} />
                        <span className="text-gray-700 dark:text-gray-300">{group.location || 'Local a ser definido'}</span>
                      </div>
                      {group.leader && (
                        <div className="flex items-center">
                          <UserGroupIcon className={`h-4 w-4 mr-2 ${colors.text}`} />
                          <span className="text-gray-700 dark:text-gray-300">Líder: {group.leader}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
                     <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                       Não Encontrou a Célula Ideal?
                     </h3>
                     <p className="text-gray-600 dark:text-gray-300 mb-6">
                       Estamos sempre abertos para criar novas células baseadas na necessidade da nossa comunidade. 
                       Entre em contato conosco e vamos conversar sobre suas necessidades.
                     </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center">
                <PhoneIcon className="h-5 w-5 mr-2" />
                Falar Conosco
              </button>
              <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center">
                <EnvelopeIcon className="h-5 w-5 mr-2" />
                Enviar Mensagem
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectPage;
