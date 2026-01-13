// API para gestão de escalas e ministérios
import { db } from '../firebase/config';
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  orderBy,
  where,
  Timestamp,
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import type {
  Ministerio,
  Escala,
  RotacaoEscala,
  MinisterioFormData,
  EscalaFormData,
  MembroEscala,
} from '../types/Scale';

// Helper para converter Timestamp do Firestore
const convertTimestamp = (timestamp: any): Date => {
  if (!timestamp) return new Date();
  if (timestamp.toDate) return timestamp.toDate();
  if (timestamp instanceof Date) return timestamp;
  if (typeof timestamp === 'string') return new Date(timestamp);
  return new Date();
};

// API para Ministérios
export const ministeriosAPI = {
  // Listar todos os ministérios
  getMinisterios: async (): Promise<Ministerio[]> => {
    try {
      console.log('🔥 Buscando ministérios no Firestore...');
      const ministeriosRef = collection(db, 'ministerios');
      const q = query(ministeriosRef, orderBy('nome', 'asc'));
      const querySnapshot = await getDocs(q);

      const ministerios = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          nome: data.nome || '',
          descricao: data.descricao || '',
          funcoes: data.funcoes || [],
          membros_habilitados: data.membros_habilitados || [],
          frequencia: data.frequencia || 'semanal',
          dia_semana: data.dia_semana,
          dia_mes: data.dia_mes,
          ativo: data.ativo !== false,
          criado_em: convertTimestamp(data.criado_em),
          atualizado_em: convertTimestamp(data.atualizado_em),
        };
      });

      console.log('✅ Ministérios carregados:', ministerios.length);
      return ministerios;
    } catch (error) {
      console.error('❌ Erro ao buscar ministérios:', error);
      toast.error('Erro ao carregar ministérios');
      return [];
    }
  },

  // Obter ministério por ID
  getMinisterio: async (id: string): Promise<Ministerio | null> => {
    try {
      const ministerioRef = doc(db, 'ministerios', id);
      const ministerioSnap = await getDoc(ministerioRef);

      if (!ministerioSnap.exists()) {
        return null;
      }

      const data = ministerioSnap.data();
      return {
        id: ministerioSnap.id,
        nome: data.nome || '',
        descricao: data.descricao || '',
        funcoes: data.funcoes || [],
        membros_habilitados: data.membros_habilitados || [],
        frequencia: data.frequencia || 'semanal',
        dia_semana: data.dia_semana,
        dia_mes: data.dia_mes,
        ativo: data.ativo !== false,
        criado_em: convertTimestamp(data.criado_em),
        atualizado_em: convertTimestamp(data.atualizado_em),
      };
    } catch (error) {
      console.error('❌ Erro ao buscar ministério:', error);
      toast.error('Erro ao carregar ministério');
      return null;
    }
  },

  // Criar ministério
  createMinisterio: async (data: MinisterioFormData): Promise<Ministerio | null> => {
    try {
      console.log('💾 Criando ministério no Firestore...');
      console.log('📝 Dados recebidos:', data);
      
      // Validar dados obrigatórios
      if (!data.nome || data.nome.trim() === '') {
        throw new Error('Nome do ministério é obrigatório');
      }

      const ministeriosRef = collection(db, 'ministerios');
      const now = Timestamp.now();
      
      // Preparar dados garantindo que todos os campos estejam definidos
      const ministerioData = {
        nome: data.nome.trim(),
        descricao: data.descricao || '',
        funcoes: Array.isArray(data.funcoes) ? data.funcoes : [],
        membros_habilitados: Array.isArray(data.membros_habilitados) ? data.membros_habilitados : [],
        frequencia: data.frequencia || 'semanal',
        dia_semana: data.dia_semana !== undefined ? data.dia_semana : null,
        dia_mes: data.dia_mes !== undefined ? data.dia_mes : null,
        ativo: data.ativo !== undefined ? data.ativo : true,
        criado_em: now,
        atualizado_em: now,
      };

      console.log('📝 Dados preparados para salvar:', ministerioData);

      const docRef = await addDoc(ministeriosRef, ministerioData);
      console.log('✅ Ministério criado com ID:', docRef.id);
      console.log('✅ Dados salvos no Firestore');

      // Criar rotação inicial (não bloquear se falhar)
      try {
        await rotacoesAPI.createRotacao(docRef.id, ministerioData.membros_habilitados);
        console.log('✅ Rotação inicial criada');
      } catch (rotacaoError) {
        console.warn('⚠️ Erro ao criar rotação inicial (não crítico):', rotacaoError);
        // Não bloquear o salvamento do ministério se a rotação falhar
      }

      toast.success('Ministério criado com sucesso!');
      
      return {
        id: docRef.id,
        nome: ministerioData.nome,
        descricao: ministerioData.descricao,
        funcoes: ministerioData.funcoes,
        membros_habilitados: ministerioData.membros_habilitados,
        frequencia: ministerioData.frequencia as 'semanal' | 'quinzenal' | 'mensal',
        dia_semana: ministerioData.dia_semana ?? undefined,
        dia_mes: ministerioData.dia_mes ?? undefined,
        ativo: ministerioData.ativo,
        criado_em: now.toDate(),
        atualizado_em: now.toDate(),
      };
    } catch (error: any) {
      console.error('❌ Erro ao criar ministério:', error);
      console.error('❌ Detalhes do erro:', error.message);
      console.error('❌ Stack trace:', error.stack);
      
      const errorMessage = error.message || 'Erro ao criar ministério. Verifique o console para mais detalhes.';
      toast.error(errorMessage);
      
      // Re-throw para que o componente possa tratar
      throw error;
    }
  },

  // Atualizar ministério
  updateMinisterio: async (id: string, data: Partial<MinisterioFormData>): Promise<void> => {
    try {
      console.log('🔄 Atualizando ministério no Firestore...');
      console.log('📝 ID:', id);
      console.log('📝 Dados recebidos:', data);
      
      const ministerioRef = doc(db, 'ministerios', id);
      
      // Preparar dados de atualização, removendo undefined
      const updateData: any = {
        atualizado_em: Timestamp.now(),
      };

      if (data.nome !== undefined) updateData.nome = data.nome.trim();
      if (data.descricao !== undefined) updateData.descricao = data.descricao || '';
      if (data.funcoes !== undefined) updateData.funcoes = Array.isArray(data.funcoes) ? data.funcoes : [];
      if (data.membros_habilitados !== undefined) updateData.membros_habilitados = Array.isArray(data.membros_habilitados) ? data.membros_habilitados : [];
      if (data.frequencia !== undefined) updateData.frequencia = data.frequencia;
      if (data.dia_semana !== undefined) updateData.dia_semana = data.dia_semana;
      if (data.dia_mes !== undefined) updateData.dia_mes = data.dia_mes;
      if (data.ativo !== undefined) updateData.ativo = data.ativo;

      console.log('📝 Dados preparados para atualizar:', updateData);
      
      await updateDoc(ministerioRef, updateData);

      console.log('✅ Ministério atualizado com sucesso');
      toast.success('Ministério atualizado com sucesso');
    } catch (error: any) {
      console.error('❌ Erro ao atualizar ministério:', error);
      console.error('❌ Detalhes do erro:', error.message);
      console.error('❌ Stack trace:', error.stack);
      
      const errorMessage = error.message || 'Erro ao atualizar ministério. Verifique o console para mais detalhes.';
      toast.error(errorMessage);
      throw error;
    }
  },

  // Deletar ministério
  deleteMinisterio: async (id: string): Promise<void> => {
    try {
      console.log('🗑️ Deletando ministério do Firestore...');
      const ministerioRef = doc(db, 'ministerios', id);
      await deleteDoc(ministerioRef);

      // Deletar rotação associada
      const rotacaoRef = doc(db, 'rotacoes', id);
      const rotacaoSnap = await getDoc(rotacaoRef);
      if (rotacaoSnap.exists()) {
        await deleteDoc(rotacaoRef);
      }

      console.log('✅ Ministério deletado');
      toast.success('Ministério deletado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao deletar ministério:', error);
      toast.error('Erro ao deletar ministério');
      throw error;
    }
  },
};

// API para Escalas
export const escalasAPI = {
  // Listar escalas
  getEscalas: async (filters?: {
    ministerio_id?: string;
    data_inicio?: Date;
    data_fim?: Date;
    status?: string;
  }): Promise<Escala[]> => {
    try {
      console.log('🔥 Buscando escalas no Firestore...');
      const escalasRef = collection(db, 'escalas');
      
      let q = query(escalasRef, orderBy('data', 'asc'));

      if (filters?.ministerio_id) {
        q = query(q, where('ministerio_id', '==', filters.ministerio_id));
      }

      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }

      const querySnapshot = await getDocs(q);

      let escalas = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ministerio_id: data.ministerio_id || '',
          ministerio_nome: data.ministerio_nome || '',
          data: convertTimestamp(data.data),
          membros: (data.membros || []).map((m: any) => ({
            ...m,
            confirmado_em: m.confirmado_em ? convertTimestamp(m.confirmado_em) : undefined,
          })),
          status: data.status || 'agendada',
          observacoes: data.observacoes,
          criado_em: convertTimestamp(data.criado_em),
          atualizado_em: convertTimestamp(data.atualizado_em),
        };
      });

      // Filtrar por data se fornecido
      if (filters?.data_inicio || filters?.data_fim) {
        escalas = escalas.filter(escala => {
          const escalaDate = new Date(escala.data);
          if (filters.data_inicio && escalaDate < filters.data_inicio) return false;
          if (filters.data_fim && escalaDate > filters.data_fim) return false;
          return true;
        });
      }

      console.log('✅ Escalas carregadas:', escalas.length);
      return escalas;
    } catch (error) {
      console.error('❌ Erro ao buscar escalas:', error);
      toast.error('Erro ao carregar escalas');
      return [];
    }
  },

  // Obter escala por ID
  getEscala: async (id: string): Promise<Escala | null> => {
    try {
      const escalaRef = doc(db, 'escalas', id);
      const escalaSnap = await getDoc(escalaRef);

      if (!escalaSnap.exists()) {
        return null;
      }

      const data = escalaSnap.data();
      return {
        id: escalaSnap.id,
        ministerio_id: data.ministerio_id || '',
        ministerio_nome: data.ministerio_nome || '',
        data: convertTimestamp(data.data),
        membros: (data.membros || []).map((m: any) => ({
          ...m,
          confirmado_em: m.confirmado_em ? convertTimestamp(m.confirmado_em) : undefined,
        })),
        status: data.status || 'agendada',
        observacoes: data.observacoes,
        criado_em: convertTimestamp(data.criado_em),
        atualizado_em: convertTimestamp(data.atualizado_em),
      };
    } catch (error) {
      console.error('❌ Erro ao buscar escala:', error);
      toast.error('Erro ao carregar escala');
      return null;
    }
  },

  // Criar escala
  createEscala: async (data: EscalaFormData, ministerioNome: string): Promise<Escala | null> => {
    try {
      console.log('💾 Criando escala no Firestore...');
      
      // Buscar nomes dos membros
      const membrosComNomes: MembroEscala[] = await Promise.all(
        data.membros.map(async (membro) => {
          const membroRef = doc(db, 'members', membro.membro_id);
          const membroSnap = await getDoc(membroRef);
          const membroData = membroSnap.data();
          
          return {
            ...membro,
            membro_nome: membroData?.name || 'Nome não encontrado',
          };
        })
      );

      const escalasRef = collection(db, 'escalas');
      const now = Timestamp.now();
      const dataTimestamp = Timestamp.fromDate(new Date(data.data));

      const escalaData = {
        ministerio_id: data.ministerio_id,
        ministerio_nome: ministerioNome,
        data: dataTimestamp,
        membros: membrosComNomes,
        status: 'agendada' as const,
        observacoes: data.observacoes || '',
        criado_em: now,
        atualizado_em: now,
      };

      const docRef = await addDoc(escalasRef, escalaData);
      console.log('✅ Escala criada com ID:', docRef.id);

      // Criar notificações para os membros escalados
      try {
        const { notificationsAPI } = await import('./notificationsAPI');
        const membrosIds = membrosComNomes.map(m => m.membro_id);
        
        // Criar notificação de nova escala para cada membro
        membrosIds.forEach(async (membroId) => {
          await notificationsAPI.createNotification(
            membroId,
            'nova_escala',
            {
              escalaId: docRef.id,
              ministerioNome: ministerioNome,
              data: new Date(data.data).toLocaleDateString('pt-BR'),
            }
          );
        });

        // Agendar lembretes automáticos
        await notificationsAPI.scheduleScaleReminders(
          docRef.id,
          ministerioNome,
          new Date(data.data),
          membrosIds
        );
      } catch (error) {
        console.warn('⚠️ Erro ao criar notificações:', error);
        // Não falhar a criação da escala se notificações falharem
      }

      return {
        id: docRef.id,
        ...escalaData,
        data: dataTimestamp.toDate(),
        criado_em: now.toDate(),
        atualizado_em: now.toDate(),
      };
    } catch (error) {
      console.error('❌ Erro ao criar escala:', error);
      toast.error('Erro ao criar escala');
      return null;
    }
  },

  // Atualizar escala
  updateEscala: async (id: string, data: Partial<EscalaFormData>): Promise<void> => {
    try {
      console.log('🔄 Atualizando escala no Firestore...');
      const escalaRef = doc(db, 'escalas', id);
      
      const updateData: any = {
        atualizado_em: Timestamp.now(),
      };

      if (data.data) {
        updateData.data = Timestamp.fromDate(new Date(data.data));
      }

      if (data.membros) {
        // Buscar nomes dos membros
        const membrosComNomes = await Promise.all(
          data.membros.map(async (membro) => {
            const membroRef = doc(db, 'members', membro.membro_id);
            const membroSnap = await getDoc(membroRef);
            const membroData = membroSnap.data();
            
            return {
              ...membro,
              membro_nome: membroData?.name || 'Nome não encontrado',
            };
          })
        );
        updateData.membros = membrosComNomes;
      }

      if (data.observacoes !== undefined) {
        updateData.observacoes = data.observacoes;
      }

      await updateDoc(escalaRef, updateData);
      console.log('✅ Escala atualizada');
      toast.success('Escala atualizada com sucesso');
    } catch (error) {
      console.error('❌ Erro ao atualizar escala:', error);
      toast.error('Erro ao atualizar escala');
      throw error;
    }
  },

  // Confirmar presença
  confirmarPresenca: async (escalaId: string, membroId: string): Promise<void> => {
    try {
      const escalaRef = doc(db, 'escalas', escalaId);
      const escalaSnap = await getDoc(escalaRef);

      if (!escalaSnap.exists()) {
        throw new Error('Escala não encontrada');
      }

      const data = escalaSnap.data();
      const membros: MembroEscala[] = data.membros.map((m: MembroEscala) => {
        if (m.membro_id === membroId) {
          return {
            ...m,
            status: 'confirmado' as const,
            confirmado_em: Timestamp.now(),
          };
        }
        return m;
      });

      await updateDoc(escalaRef, {
        membros,
        atualizado_em: Timestamp.now(),
      });

      // Criar notificação para líderes do ministério
      try {
        const { notificationsAPI } = await import('./notificationsAPI');
        const membroEscalado = membros.find((m: MembroEscala) => m.membro_id === membroId);
        
        // Buscar líderes do ministério
        const ministerioSnap = await getDoc(doc(db, 'ministerios', data.ministerio_id));
        
        if (ministerioSnap.exists()) {
          const ministerioData = ministerioSnap.data();
          // Notificar líderes (buscar usuários com role 'lider' e mesmo ministerio_id)
          // Por enquanto, criar notificação genérica
          await notificationsAPI.createNotification(
            data.ministerio_id, // Usar ministerio_id como referência
            'confirmacao_presenca',
            {
              escalaId,
              membroNome: membroEscalado?.membro_nome || 'Membro',
              ministerioNome: data.ministerio_nome,
            }
          );
        }
      } catch (error) {
        console.warn('⚠️ Erro ao criar notificação de confirmação:', error);
      }
    } catch (error) {
      console.error('❌ Erro ao confirmar presença:', error);
      toast.error('Erro ao confirmar presença');
      throw error;
    }
  },

  // Deletar escala
  deleteEscala: async (id: string): Promise<void> => {
    try {
      console.log('🗑️ Deletando escala do Firestore...');
      const escalaRef = doc(db, 'escalas', id);
      await deleteDoc(escalaRef);

      console.log('✅ Escala deletada');
      toast.success('Escala deletada com sucesso');
    } catch (error) {
      console.error('❌ Erro ao deletar escala:', error);
      toast.error('Erro ao deletar escala');
      throw error;
    }
  },
};

// API para Rotações
export const rotacoesAPI = {
  // Criar rotação inicial
  createRotacao: async (ministerioId: string, membros: string[]): Promise<void> => {
    try {
      console.log('🔄 Criando rotação inicial para ministério:', ministerioId);
      const rotacaoRef = doc(db, 'rotacoes', ministerioId);
      
      const rotacaoData = {
        ministerio_id: ministerioId,
        membros: Array.isArray(membros) ? membros : [],
        proximo_indice: 0,
        historico: [],
        atualizado_em: Timestamp.now(),
      };

      // Verificar se já existe
      const rotacaoSnap = await getDoc(rotacaoRef);
      if (rotacaoSnap.exists()) {
        // Atualizar se já existe
        await updateDoc(rotacaoRef, rotacaoData);
        console.log('✅ Rotação atualizada');
      } else {
        // Criar nova
        await setDoc(rotacaoRef, rotacaoData);
        console.log('✅ Rotação criada');
      }
    } catch (error) {
      console.error('❌ Erro ao criar rotação:', error);
      // Não bloquear o salvamento do ministério
      throw error;
    }
  },

  // Obter rotação
  getRotacao: async (ministerioId: string): Promise<RotacaoEscala | null> => {
    try {
      const rotacaoRef = doc(db, 'rotacoes', ministerioId);
      const rotacaoSnap = await getDoc(rotacaoRef);

      if (!rotacaoSnap.exists()) {
        return null;
      }

      const data = rotacaoSnap.data();
      return {
        id: rotacaoSnap.id,
        ministerio_id: data.ministerio_id || ministerioId,
        membros: data.membros || [],
        proximo_indice: data.proximo_indice || 0,
        historico: (data.historico || []).map((h: any) => ({
          ...h,
          data: convertTimestamp(h.data),
        })),
        atualizado_em: convertTimestamp(data.atualizado_em),
      };
    } catch (error) {
      console.error('❌ Erro ao buscar rotação:', error);
      return null;
    }
  },

  // Gerar próxima escala automaticamente
  gerarProximaEscala: async (
    ministerioId: string,
    data: Date,
    funcoes: string[]
  ): Promise<EscalaFormData | null> => {
    try {
      const rotacao = await rotacoesAPI.getRotacao(ministerioId);
      if (!rotacao || rotacao.membros.length === 0) {
        throw new Error('Rotação não encontrada ou sem membros');
      }

      const ministerio = await ministeriosAPI.getMinisterio(ministerioId);
      if (!ministerio) {
        throw new Error('Ministério não encontrado');
      }

      const membrosEscalados: Omit<MembroEscala, 'membro_nome'>[] = [];

      // Para cada função, escalar um membro
      for (const funcao of funcoes) {
        // Encontrar próximo membro disponível
        let tentativas = 0;
        let membroEscalado = false;

        while (!membroEscalado && tentativas < rotacao.membros.length) {
          const indice = (rotacao.proximo_indice + tentativas) % rotacao.membros.length;
          const membroId = rotacao.membros[indice];

          // Verificar se membro tem a função (simplificado - pode ser melhorado)
          membrosEscalados.push({
            membro_id: membroId,
            funcao,
            status: 'pendente',
          });

          membroEscalado = true;
          rotacao.proximo_indice = (indice + 1) % rotacao.membros.length;
          tentativas++;
        }
      }

      // Atualizar rotação
      const rotacaoRef = doc(db, 'rotacoes', ministerioId);
      await updateDoc(rotacaoRef, {
        proximo_indice: rotacao.proximo_indice,
        historico: [
          ...rotacao.historico,
          ...membrosEscalados.map(m => ({
            data: Timestamp.fromDate(data),
            membro_id: m.membro_id,
            funcao: m.funcao,
          })),
        ],
        atualizado_em: Timestamp.now(),
      });

      return {
        ministerio_id: ministerioId,
        data: data.toISOString().split('T')[0],
        membros: membrosEscalados,
      };
    } catch (error) {
      console.error('❌ Erro ao gerar próxima escala:', error);
      toast.error('Erro ao gerar escala automática');
      return null;
    }
  },
};
