import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreateEsbocoDTO,
  EstruturaEsboco,
  esbocosService,
  TemaPrincipal,
  TipoCulto,
} from '../../services/esbocosService';
import LoadingSpinner from '../../components/LoadingSpinner';

const temas: { value: TemaPrincipal; label: string }[] = [
  { value: 'FAMILIA', label: 'Família' },
  { value: 'FE', label: 'Fé' },
  { value: 'SANTIDADE', label: 'Santidade' },
  { value: 'AVIVAMENTO', label: 'Avivamento' },
  { value: 'CURAS', label: 'Curas' },
  { value: 'JOVENS', label: 'Jovens' },
  { value: 'MISSOES', label: 'Missões' },
  { value: 'OUTRO', label: 'Outros temas' },
];

const tiposCulto: { value: TipoCulto; label: string }[] = [
  { value: 'DOMINGO', label: 'Culto de Domingo' },
  { value: 'CELULA', label: 'Célula' },
  { value: 'JOVENS', label: 'Jovens' },
  { value: 'ENSINO', label: 'Ensino' },
  { value: 'ORACAO', label: 'Oração' },
  { value: 'SANTA_CEIA', label: 'Santa Ceia' },
  { value: 'OUTRO', label: 'Outro' },
];

const NovoEsbocoPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setSucesso(null);

    if (!form.titulo.trim() || !form.textoBiblicoBase.trim() || !form.autorNome.trim()) {
      setErro('Preencha pelo menos o título, o texto bíblico base e o nome do autor.');
      return;
    }

    if (!form.estrutura.introducao.trim()) {
      setErro('Preencha pelo menos a introdução do esboço.');
      return;
    }

    try {
      setLoading(true);
      const criado = await esbocosService.criarEsboco(form);
      setSucesso('Esboço enviado com sucesso! Ele será analisado pela liderança antes de ser publicado.');
      // Redirecionar após alguns segundos para a página de lista
      setTimeout(() => {
        navigate('/esbocos');
      }, 2000);
      console.log('Esboço criado:', criado);
    } catch (e) {
      console.error(e);
      setErro('Não foi possível enviar o esboço. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 min-h-screen">
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-gray-900 dark:text-white mb-3">
              Enviar Esboço de Pregação
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
              Compartilhe um esboço que Deus colocou no seu coração. Ele será revisado pela liderança antes de ser disponibilizado para toda a igreja.
            </p>
          </header>

          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 space-y-6"
          >
            {erro && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {erro}
              </div>
            )}
            {sucesso && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                {sucesso}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Título do esboço *
                </label>
                <input
                  type="text"
                  value={form.titulo}
                  onChange={(e) => handleChange('titulo', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                  placeholder="Ex: O Amor que Restaura Famílias"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tema principal *
                </label>
                <select
                  value={form.temaPrincipal}
                  onChange={(e) =>
                    handleChange('temaPrincipal', e.target.value as TemaPrincipal)
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                >
                  {temas.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Texto bíblico base *
                </label>
                <input
                  type="text"
                  value={form.textoBiblicoBase}
                  onChange={(e) => handleChange('textoBiblicoBase', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                  placeholder="Ex: João 3:16"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de culto
                </label>
                <select
                  value={form.tipoCulto}
                  onChange={(e) =>
                    handleChange('tipoCulto', e.target.value as TipoCulto)
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                >
                  {tiposCulto.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome do autor *
                </label>
                <input
                  type="text"
                  value={form.autorNome}
                  onChange={(e) => handleChange('autorNome', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                  placeholder="Seu nome"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Igreja / Ministério
                </label>
                <input
                  type="text"
                  value={form.autorIgreja || ''}
                  onChange={(e) => handleChange('autorIgreja', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                  placeholder="Ex: Comunidade Cristã Resgate"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duração estimada (minutos)
                </label>
                <input
                  type="number"
                  min={10}
                  max={120}
                  value={form.duracaoEstimadaMinutos ?? ''}
                  onChange={(e) =>
                    handleChange(
                      'duracaoEstimadaMinutos',
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                  placeholder="Ex: 40"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Palavras-chave / Tags (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={form.tags?.join(', ') || ''}
                  onChange={(e) =>
                    handleChange(
                      'tags',
                      e.target.value
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean)
                    )
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                  placeholder="Ex: família, aliança, restauração"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Introdução *
                </label>
                <textarea
                  value={form.estrutura.introducao}
                  onChange={(e) => handleEstruturaChange('introducao', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                  placeholder="Apresente o contexto bíblico e a direção geral da mensagem..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tópico 1
                  </label>
                  <textarea
                    value={form.estrutura.topico1 || ''}
                    onChange={(e) => handleEstruturaChange('topico1', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tópico 2
                  </label>
                  <textarea
                    value={form.estrutura.topico2 || ''}
                    onChange={(e) => handleEstruturaChange('topico2', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tópico 3
                  </label>
                  <textarea
                    value={form.estrutura.topico3 || ''}
                    onChange={(e) => handleEstruturaChange('topico3', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Conclusão
                  </label>
                  <textarea
                    value={form.estrutura.conclusao || ''}
                    onChange={(e) => handleEstruturaChange('conclusao', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Apelo
                </label>
                <textarea
                  value={form.estrutura.apelo || ''}
                  onChange={(e) => handleEstruturaChange('apelo', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                  placeholder="Sugestão de apelo, oração ou momento de entrega..."
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Ao enviar, você concorda que o esboço poderá ser editado pela liderança para correções teológicas e de linguagem.
              </p>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-sm transition"
              >
                {loading ? (
                  <>
                    <LoadingSpinner />
                    <span className="ml-2">Enviando...</span>
                  </>
                ) : (
                  'Enviar esboço'
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default NovoEsbocoPage;


