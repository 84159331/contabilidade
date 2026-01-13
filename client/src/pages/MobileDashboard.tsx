// Dashboard Mobile otimizado para membros
import React, { useState } from 'react';
import { useUserRole } from '../hooks/useUserRole';
import { useNotifications } from '../hooks/useNotifications';
import { escalasAPI } from '../services/scalesAPI';
import type { Escala } from '../types/Scale';
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  BellIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const MobileDashboard: React.FC = () => {
  const { profile, isMembro, isLider, isAdmin } = useUserRole();
  const { notifications, unreadCount } = useNotifications();
  const [myScales, setMyScales] = useState<Escala[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (profile?.id) {
      loadMyScales();
    }
  }, [profile?.id]);

  const loadMyScales = async () => {
    try {
      setLoading(true);
      const allEscalas = await escalasAPI.getEscalas();
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      // Filtrar apenas escalas futuras onde o membro está escalado
      const escalas = allEscalas
        .filter(escala => {
          const escalaDate = new Date(escala.data);
          escalaDate.setHours(0, 0, 0, 0);
          return escalaDate >= hoje;
        })
        .filter(escala =>
          escala.membros.some(membro => membro.membro_id === profile?.id)
        )
        .slice(0, 5); // Apenas próximas 5
      
      setMyScales(escalas);
    } catch (error) {
      console.error('Erro ao carregar escalas:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });
  };

  const getMyFunction = (escala: Escala): string => {
    const membro = escala.membros.find(m => m.membro_id === profile?.id);
    return membro?.funcao || 'Não definida';
  };

  const getMyStatus = (escala: Escala): 'pendente' | 'confirmado' => {
    const membro = escala.membros.find(m => m.membro_id === profile?.id);
    return membro?.status === 'confirmado' ? 'confirmado' : 'pendente';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white p-6 rounded-xl">
        <h1 className="text-2xl font-bold mb-2">
          Olá, {profile?.name || 'Membro'}!
        </h1>
        <p className="text-primary-100 text-sm">
          {isMembro && 'Bem-vindo ao seu dashboard'}
          {isLider && 'Painel de controle do líder'}
          {isAdmin && 'Painel administrativo'}
        </p>
      </div>

      {/* Notificações */}
      {unreadCount > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BellIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <span className="font-semibold text-yellow-900 dark:text-yellow-100">
                {unreadCount} {unreadCount === 1 ? 'notificação' : 'notificações'} não lidas
              </span>
            </div>
            <Link
              to="/tesouraria/notifications"
              className="text-sm text-yellow-700 dark:text-yellow-300 font-medium"
            >
              Ver todas
            </Link>
          </div>
        </div>
      )}

      {/* Próximas Escalas */}
      {isMembro && myScales.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Próximas Escalas
            </h2>
            <Link
              to="/tesouraria/my-scales"
              className="text-sm text-primary-600 dark:text-primary-400 font-medium"
            >
              Ver todas
            </Link>
          </div>
          <div className="space-y-3">
            {myScales.map((escala) => {
              const myStatus = getMyStatus(escala);
              const myFunction = getMyFunction(escala);

              return (
                <Link
                  key={escala.id}
                  to="/tesouraria/my-scales"
                  className="block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {escala.ministerio_nome}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          {formatDate(escala.data)}
                        </div>
                        <span>{myFunction}</span>
                      </div>
                    </div>
                    {myStatus === 'confirmado' ? (
                      <CheckCircleIcon className="h-6 w-6 text-green-600" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-yellow-500"></div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Cards de Acesso Rápido */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Acesso Rápido
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {isMembro && (
            <>
              <Link
                to="/tesouraria/my-scales"
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center hover:shadow-md transition-shadow"
              >
                <ClipboardDocumentListIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Minhas Escalas
                </span>
              </Link>
              <Link
                to="/tesouraria/events"
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center hover:shadow-md transition-shadow"
              >
                <CalendarIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Eventos
                </span>
              </Link>
            </>
          )}

          {(isLider || isAdmin) && (
            <>
              <Link
                to="/tesouraria/scales"
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center hover:shadow-md transition-shadow"
              >
                <ClipboardDocumentListIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Escalas
                </span>
              </Link>
              <Link
                to="/tesouraria/members"
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center hover:shadow-md transition-shadow"
              >
                <UserGroupIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Membros
                </span>
              </Link>
              <Link
                to="/tesouraria/reports"
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center hover:shadow-md transition-shadow"
              >
                <ChartBarIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Relatórios
                </span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Últimas Notificações */}
      {notifications.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notificações Recentes
            </h2>
            <Link
              to="/tesouraria/notifications"
              className="text-sm text-primary-600 dark:text-primary-400 font-medium"
            >
              Ver todas
            </Link>
          </div>
          <div className="space-y-2">
            {notifications.slice(0, 3).map((notification) => (
              <div
                key={notification.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 ${
                  !notification.read ? 'border-l-4 border-l-primary-600' : ''
                }`}
              >
                <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                  {notification.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {notification.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileDashboard;
