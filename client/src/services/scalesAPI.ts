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
      const ministeriosRef = collection(db, 'ministerios');
      const now = Timestamp.now();
      
      const ministerioData = {
        ...data,
        criado_em: now,
        atualizado_em: now,
      };

      const docRef = await addDoc(ministeriosRef, ministerioData);
      console.log('✅ Ministério criado com ID:', docRef.id);

      // Criar rotação inicial
      await rotacoesAPI.createRotacao(docRef.id, data.membros_habilitados);

      return {
        id: docRef.id,
        ...data,
        criado_em: now.toDate(),
        atualizado_em: now.toDate(),
      };
    } catch (error) {
      console.error('❌ Erro ao criar ministério:', error);
      toast.error('Erro ao criar ministério');
      return null;
    }
  },

  // Atualizar ministério
  updateMinisterio: async (id: string, data: Partial<MinisterioFormData>): Promise<void> => {
    try {
      console.log('🔄 Atualizando ministério no Firestore...');
      const ministerioRef = doc(db, 'ministerios', id);
      
      await updateDoc(ministerioRef, {
        ...data,
        atualizado_em: Timestamp.now(),
      });

      console.log('✅ Ministério atualizado');
      toast.success('Ministério atualizado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao atualizar ministério:', error);
      toast.error('Erro ao atualizar ministério');
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
      const membros = data.membros.map((m: MembroEscala) => {
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

      toast.success('Presença confirmada!');
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

  // Criar rotação
  createRotacao: async (ministerioId: string, membros: string[]): Promise<void> => {
    try {
      const rotacaoRef = doc(db, 'rotacoes', ministerioId);
      const now = Timestamp.now();

      await updateDoc(rotacaoRef, {
        ministerio_id: ministerioId,
        membros,
        proximo_indice: 0,
        historico: [],
        atualizado_em: now,
      });
    } catch (error) {
      // Se não existir, criar
      const rotacaoRef = doc(db, 'rotacoes', ministerioId);
      const now = Timestamp.now();

      await updateDoc(rotacaoRef, {
        ministerio_id: ministerioId,
        membros,
        proximo_indice: 0,
        historico: [],
        atualizado_em: now,
      });
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
