// Página para membros visualizarem suas escalas
import React, { useState, useEffect } from 'react';
import { useUserRole } from '../hooks/useUserRole';
import { escalasAPI } from '../services/scalesAPI';
import type { Escala } from '../types/Scale';
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const MyScales: React.FC = () => {
  const { profile } = useUserRole();
  const [escalas, setEscalas] = useState<Escala[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) {
      loadMyScales();
    }
  }, [profile?.id]);

  const loadMyScales = async () => {
    try {
      setLoading(true);
      const allEscalas = await escalasAPI.getEscalas();
      
      // Filtrar apenas escalas onde o membro está escalado
      const myEscalas = allEscalas.filter(escala =>
        escala.membros.some(membro => membro.membro_id === profile?.id)
      );
      
      setEscalas(myEscalas);
    } catch (error) {
      console.error('Erro ao carregar escalas:', error);
      toast.error('Erro ao carregar suas escalas');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPresence = async (escalaId: string) => {
    if (!profile?.id) return;

    try {
      await escalasAPI.confirmarPresenca(escalaId, profile.id);
      toast.success('Presença confirmada!');
      loadMyScales();
    } catch (error) {
      console.error('Erro ao confirmar presença:', error);
      toast.error('Erro ao confirmar presença');
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMyFunction = (escala: Escala): string => {
    const membro = escala.membros.find(m => m.membro_id === profile?.id);
    return membro?.funcao || 'Não definida';
  };

  const getMyStatus = (escala: Escala): 'pendente' | 'confirmado' | 'substituido' | 'ausente' => {
    const membro = escala.membros.find(m => m.membro_id === profile?.id);
    return membro?.status || 'pendente';
  };

  const isPast = (date: Date | string): boolean => {
    return new Date(date) < new Date();
  };

  // Separar escalas futuras e passadas
  const escalasFuturas = escalas.filter(e => !isPast(e.data));
  const escalasPassadas = escalas.filter(e => isPast(e.data));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando suas escalas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Minhas Escalas
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Visualize e confirme suas escalas
        </p>
      </div>

      {/* Escalas Futuras */}
      {escalasFuturas.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Próximas Escalas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {escalasFuturas.map((escala) => {
              const myStatus = getMyStatus(escala);
              const myFunction = getMyFunction(escala);
              const isConfirmed = myStatus === 'confirmado';

              return (
                <div
                  key={escala.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <ClipboardDocumentListIcon className="h-5 w-5 text-primary-600" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {escala.ministerio_nome}
                        </h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          {formatDate(escala.data)}
                        </div>
                        <div className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          {formatTime(escala.data)}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        isConfirmed
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}
                    >
                      {isConfirmed ? 'Confirmado' : 'Pendente'}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <strong>Sua função:</strong> {myFunction}
                    </p>
                    {escala.observacoes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {escala.observacoes}
                      </p>
                    )}
                  </div>

                  {!isConfirmed && (
                    <button
                      onClick={() => handleConfirmPresence(escala.id)}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircleIcon className="h-5 w-5" />
                      Confirmar Presença
                    </button>
                  )}

                  {isConfirmed && (
                    <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircleIcon className="h-5 w-5" />
                      <span className="text-sm font-medium">Presença confirmada</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Escalas Passadas */}
      {escalasPassadas.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Escalas Passadas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {escalasPassadas.slice(0, 6).map((escala) => {
              const myFunction = getMyFunction(escala);
              const myStatus = getMyStatus(escala);

              return (
                <div
                  key={escala.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        {escala.ministerio_nome}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {formatDate(escala.data)} - {myFunction}
                      </p>
                    </div>
                    {myStatus === 'confirmado' && (
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    )}
                    {myStatus === 'ausente' && (
                      <XCircleIcon className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {escalas.length === 0 && (
        <div className="text-center py-12">
          <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Você não possui escalas no momento
          </p>
        </div>
      )}
    </div>
  );
};

export default MyScales;
