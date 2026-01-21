import React, { useEffect, useState } from 'react';
import { esbocosService, Esboco, TemaPrincipal } from '../../services/esbocosService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import { getBibliaOnEsbocosIndexUrl } from '../../utils/bibliaOn';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

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

const EsbocosPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [esbocos, setEsbocos] = useState<Esboco[]>([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroTema, setFiltroTema] = useState<string>('TODOS');

  useEffect(() => {
    let ativo = true;
    const carregar = async () => {
      try {
        setLoading(true);
        const result = await esbocosService.listarEsbocosAprovados({ pagina: 1, limite: 50 });
        if (!ativo) return;
        setEsbocos(result.itens);
        setErro(null);
      } catch (e) {
        console.error(e);
        if (!ativo) return;
        setErro('Não foi possível carregar os esboços. Tente novamente mais tarde.');
      } finally {
        if (ativo) setLoading(false);
      }
    };
    carregar();
    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    let ativo = true;
    const t = setTimeout(async () => {
      try {
        setLoading(true);
        const result = await esbocosService.listarEsbocosAprovados({
          pagina: 1,
          limite: 50,
          termo: termoBusca.trim() ? termoBusca.trim() : undefined,
          temaPrincipal: filtroTema !== 'TODOS' ? (filtroTema as TemaPrincipal) : undefined,
        });
        if (!ativo) return;
        setEsbocos(result.itens);
        setErro(null);
      } catch (e) {
        console.error(e);
        if (!ativo) return;
        setErro('Não foi possível carregar os esboços. Tente novamente mais tarde.');
      } finally {
        if (ativo) setLoading(false);
      }
    }, 250);

    return () => {
      ativo = false;
      clearTimeout(t);
    };
  }, [termoBusca, filtroTema]);

  const handleIrParaBibliaOn = () => {
    window.open(getBibliaOnEsbocosIndexUrl(), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 min-h-[100dvh]">
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <header className="mb-8 sm:mb-10">
            <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-gray-900 dark:text-white mb-3">
              Esboços de Pregação
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
              Aqui você encontra esboços preparados e aprovados pela liderança da Comunidade Cristã Resgate.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Para explorar muitos outros esboços de pregação, você pode acessar diretamente o Bíbliaon.
            </p>
            <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
              <button
                type="button"
                onClick={handleIrParaBibliaOn}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold shadow-md hover:shadow-lg transition w-full sm:w-auto"
              >
                Ver mais esboços no Bíbliaon
              </button>
              <Link
                to="/novo-esboco"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 text-sm font-semibold shadow-sm hover:shadow transition w-full sm:w-auto"
              >
                Enviar novo esboço
              </Link>
            </div>
          </header>

          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-5 sm:p-6 border border-gray-100 dark:border-gray-700 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
              <div className="sm:col-span-2 lg:col-span-7">
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por título, autor ou texto bíblico..."
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                  />
                </div>
              </div>
              <div className="lg:col-span-5">
                <select
                  value={filtroTema}
                  onChange={(e) => setFiltroTema(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                >
                  <option value="TODOS">Todos os temas</option>
                  {temas.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Lista de esboços */}

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : erro ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {erro}
            </div>
          ) : esbocos.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
              Ainda não há esboços cadastrados pela liderança. Em breve novos conteúdos estarão disponíveis.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {esbocos.map((esboco) => (
                <article
                  key={esboco.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 flex flex-col justify-between"
                >
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {esboco.titulo}
                    </h2>
                    <p className="text-sm text-primary-600 dark:text-primary-400 mb-2">
                      Texto base: {esboco.textoBiblicoBase}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      por <span className="font-semibold">{esboco.autorNome}</span>
                    </p>
                    {esboco.estrutura?.introducao && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                        {esboco.estrutura.introducao}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                      {esboco.temaPrincipal && (
                        <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                          {temas.find((t) => t.value === esboco.temaPrincipal)?.label || esboco.temaPrincipal}
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/esbocos/${esboco.id}`}
                      className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      Ver esboço completo
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default EsbocosPage;


