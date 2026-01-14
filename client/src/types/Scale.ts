// Tipos para o sistema de escalas

export interface Ministerio {
  id: string;
  nome: string;
  descricao: string;
  funcoes: string[]; // ["Vocal", "Instrumentista", "TÃ©cnico de Som"]
  membros_habilitados: string[]; // IDs dos membros
  frequencia: 'semanal' | 'quinzenal' | 'mensal';
  dia_semana?: number; // 0 = Domingo, 1 = Segunda, etc.
  dia_mes?: number; // Para frequÃªncia mensal
  ativo: boolean;
  criado_em: Date | string;
  atualizado_em: Date | string;
}

export interface MembroEscala {
  membro_id: string;
  membro_nome: string;
  funcao: string;
  status: 'pendente' | 'confirmado' | 'substituido' | 'ausente';
  confirmado_em?: Date | string;
  substituido_por?: string;
  observacoes?: string;
}

export interface Escala {
  id: string;
  ministerio_id: string;
  ministerio_nome: string;
  data: Date | string;
  membros: MembroEscala[];
  status: 'agendada' | 'confirmada' | 'cancelada' | 'concluida';
  observacoes?: string;
  criado_em: Date | string;
  atualizado_em: Date | string;
}

export interface RotacaoEscala {
  id: string;
  ministerio_id: string;
  membros: string[]; // IDs dos membros em ordem de rotaÃ§Ã£o
  proximo_indice: number;
  historico: {
    data: Date | string;
    membro_id: string;
    funcao: string;
  }[];
  atualizado_em: Date | string;
}

export interface MinisterioFormData {
  nome: string;
  descricao: string;
  funcoes: string[];
  membros_habilitados: string[];
  frequencia: 'semanal' | 'quinzenal' | 'mensal';
  dia_semana?: number;
  dia_mes?: number;
  ativo: boolean;
}

export interface EscalaFormData {
  ministerio_id: string;
  data: string;
  membros: Omit<MembroEscala, 'membro_nome'>[];
  observacoes?: string;
}
