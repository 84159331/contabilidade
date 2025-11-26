import React, { useEffect, useState } from 'react';
import {
  CreateEsbocoDTO,
  Esboco,
  esbocosService,
  StatusEsboco,
  TemaPrincipal,
  TipoCulto,
  EstruturaEsboco,
} from '../services/esbocosService';
import LoadingSpinner from '../components/LoadingSpinner';

const statusLabels: Record<StatusEsboco, string> = {
  PENDENTE: 'Pendente',
  APROVADO: 'Aprovado',
  REPROVADO: 'Reprovado',
  ARQUIVADO: 'Arquivado',
};

const EsbocosAdminPage: React.FC = () => {
  const [esbocos, setEsbocos] = useState<Esboco[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [atualizandoId, setAtualizandoId] = useState<number | null>(null);
  const [criando, setCriando] = useState(false);
  const [mensagemCriacao, setMensagemCriacao] = useState<string | null>(null);

  const [form, setForm] = useState<CreateEsbocoDTO>({
    titulo: '',
    temaPrincipal: 'OUTRO',
    textoBiblicoBase: '',
    autorNome: '',
    estrutura: {
      introducao: '',
      topico1: '',
      topico2: '',
      topico3: '',
      conclusao: '',
      apelo: '',
    },
    tipoCulto: 'DOMINGO',
  });

  const handleChange = (field: keyof CreateEsbocoDTO, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEstruturaChange = (field: keyof EstruturaEsboco, value: string) => {
    setForm((prev) => ({
      ...prev,
      estrutura: {
        ...prev.estrutura,
        [field]: value,
      },
    }));
  };

  const carregarEsbocos = async () => {
    try {
      setLoading(true);
      const todos = await esbocosService.listarTodos();
      setEsbocos(todos);
      setErro(null);
    } catch (e) {
      console.error(e);
      setErro('Não foi possível carregar os esboços pendentes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarEsbocos();
  }, []);

  const atualizarStatus = async (id: number, status: StatusEsboco) => {
    try {
      setAtualizandoId(id);
      await esbocosService.atualizarStatus(id, { status, aprovadoPor: 'Admin' });
      await carregarEsbocos();
    } catch (e) {
      console.error(e);
      setErro('Não foi possível atualizar o status do esboço.');
    } finally {
      setAtualizandoId(null);
    }
  };

  const removerEsboco = async (id: number) => {
    const confirmar = window.confirm('Tem certeza que deseja remover este esboço definitivamente?');
    if (!confirmar) return;

    try {
      setAtualizandoId(id);
      await esbocosService.removerEsboco(id);
      await carregarEsbocos();
    } catch (e) {
      console.error(e);
      setErro('Não foi possível remover o esboço.');
    } finally {
      setAtualizandoId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Esboços de Pregação</h1>

      {/* Seção de criação de esboço pela liderança */}
      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Novo esboço (somente liderança)</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Crie aqui esboços oficiais que serão exibidos na área pública de esboços, após aprovação.
        </p>

        {mensagemCriacao && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-3 py-2 rounded mb-3 text-sm">
            {mensagemCriacao}
          </div>
        )}

        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setErro(null);
            setMensagemCriacao(null);

            if (!form.titulo.trim() || !form.textoBiblicoBase.trim() || !form.autorNome.trim()) {
              setErro('Preencha pelo menos o título, o texto bíblico base e o nome do autor.');
              return;
            }

            if (!form.estrutura.introducao.trim()) {
              setErro('Preencha pelo menos a introdução do esboço.');
              return;
            }

            try {
              setCriando(true);
              await esbocosService.criarEsboco(form);
              setMensagemCriacao('Esboço criado com sucesso! Agora você pode gerenciá-lo na lista abaixo.');
              setForm((prev) => ({
                ...prev,
                titulo: '',
                textoBiblicoBase: '',
                autorNome: '',
                autorIgreja: '',
                duracaoEstimadaMinutos: undefined,
                tags: [],
                estrutura: {
                  introducao: '',
                  topico1: '',
                  topico2: '',
                  topico3: '',
                  conclusao: '',
                  apelo: '',
                },
              }));
              await carregarEsbocos();
            } catch (e) {
              console.error(e);
              setErro('Não foi possível criar o esboço. Tente novamente mais tarde.');
            } finally {
              setCriando(false);
            }
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Título *
              </label>
              <input
                type="text"
                value={form.titulo}
                onChange={(e) => handleChange('titulo', e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tema principal *
              </label>
              <select
                value={form.temaPrincipal}
                onChange={(e) =>
                  handleChange('temaPrincipal', e.target.value as TemaPrincipal)
                }
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm"
              >
                <option value="FAMILIA">Família</option>
                <option value="FE">Fé</option>
                <option value="SANTIDADE">Santidade</option>
                <option value="AVIVAMENTO">Avivamento</option>
                <option value="CURAS">Curas</option>
                <option value="JOVENS">Jovens</option>
                <option value="MISSOES">Missões</option>
                <option value="OUTRO">Outros temas</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Texto bíblico base *
              </label>
              <input
                type="text"
                value={form.textoBiblicoBase}
                onChange={(e) => handleChange('textoBiblicoBase', e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo de culto
              </label>
              <select
                value={form.tipoCulto}
                onChange={(e) =>
                  handleChange('tipoCulto', e.target.value as TipoCulto)
                }
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm"
              >
                <option value="DOMINGO">Culto de Domingo</option>
                <option value="CELULA">Célula</option>
                <option value="JOVENS">Jovens</option>
                <option value="ENSINO">Ensino</option>
                <option value="ORACAO">Oração</option>
                <option value="SANTA_CEIA">Santa Ceia</option>
                <option value="OUTRO">Outro</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Autor *
              </label>
              <input
                type="text"
                value={form.autorNome}
                onChange={(e) => handleChange('autorNome', e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Igreja / Ministério
              </label>
              <input
                type="text"
                value={form.autorIgreja || ''}
                onChange={(e) => handleChange('autorIgreja', e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Introdução *
            </label>
            <textarea
              value={form.estrutura.introducao}
              onChange={(e) => handleEstruturaChange('introducao', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tópico 1
              </label>
              <textarea
                value={form.estrutura.topico1 || ''}
                onChange={(e) => handleEstruturaChange('topico1', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tópico 2
              </label>
              <textarea
                value={form.estrutura.topico2 || ''}
                onChange={(e) => handleEstruturaChange('topico2', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tópico 3
              </label>
              <textarea
                value={form.estrutura.topico3 || ''}
                onChange={(e) => handleEstruturaChange('topico3', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tópico 4
              </label>
              <textarea
                value={form.estrutura.topico4 || ''}
                onChange={(e) => handleEstruturaChange('topico4', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tópico 5
              </label>
              <textarea
                value={form.estrutura.topico5 || ''}
                onChange={(e) => handleEstruturaChange('topico5', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tópico 6
              </label>
              <textarea
                value={form.estrutura.topico6 || ''}
                onChange={(e) => handleEstruturaChange('topico6', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tópico 7
              </label>
              <textarea
                value={form.estrutura.topico7 || ''}
                onChange={(e) => handleEstruturaChange('topico7', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tópico 8
              </label>
              <textarea
                value={form.estrutura.topico8 || ''}
                onChange={(e) => handleEstruturaChange('topico8', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tópico 9
              </label>
              <textarea
                value={form.estrutura.topico9 || ''}
                onChange={(e) => handleEstruturaChange('topico9', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Conclusão
              </label>
              <textarea
                value={form.estrutura.conclusao || ''}
                onChange={(e) => handleEstruturaChange('conclusao', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Apelo
              </label>
              <textarea
                value={form.estrutura.apelo || ''}
                onChange={(e) => handleEstruturaChange('apelo', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={criando}
              className="px-4 py-2 rounded bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold disabled:opacity-60"
            >
              {criando ? 'Salvando...' : 'Salvar esboço'}
            </button>
          </div>
        </form>
      </section>

      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {erro}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-10">
          <LoadingSpinner />
        </div>
      ) : esbocos.length === 0 ? (
        <p className="text-gray-600">Nenhum esboço cadastrado até o momento.</p>
      ) : (
        <div className="space-y-4">
          {esbocos.map((esboco) => (
            <div
              key={esboco.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="text-lg font-semibold">{esboco.titulo}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {esboco.autorNome}
                    {esboco.autorIgreja && ` · ${esboco.autorIgreja}`}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Texto base: {esboco.textoBiblicoBase} · Status atual:{' '}
                    {statusLabels[esboco.status]}
                  </p>
                  <p className="mt-3 text-sm text-gray-700 dark:text-gray-200 line-clamp-3">
                    {esboco.estrutura.introducao}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    disabled={atualizandoId === esboco.id}
                    onClick={() => atualizarStatus(esboco.id, 'APROVADO')}
                    className="px-3 py-1.5 rounded-md bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-semibold"
                  >
                    Aprovar
                  </button>
                  <button
                    type="button"
                    disabled={atualizandoId === esboco.id}
                    onClick={() => atualizarStatus(esboco.id, 'REPROVADO')}
                    className="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-semibold"
                  >
                    Reprovar
                  </button>
                  <button
                    type="button"
                    disabled={atualizandoId === esboco.id}
                    onClick={() => atualizarStatus(esboco.id, 'ARQUIVADO')}
                    className="px-3 py-1.5 rounded-md bg-gray-600 hover:bg-gray-700 disabled:opacity-60 text-white text-sm font-semibold"
                  >
                    Arquivar
                  </button>
                  <button
                    type="button"
                    disabled={atualizandoId === esboco.id}
                    onClick={() => removerEsboco(esboco.id)}
                    className="px-3 py-1.5 rounded-md bg-red-800 hover:bg-red-900 disabled:opacity-60 text-white text-sm font-semibold"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EsbocosAdminPage;


