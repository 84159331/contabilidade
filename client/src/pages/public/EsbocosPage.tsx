import React, { useEffect, useState } from 'react';
import { esbocosService, Esboco } from '../../services/esbocosService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import { getBibliaOnEsbocosIndexUrl } from '../../utils/bibliaOn';

const EsbocosPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [esbocos, setEsbocos] = useState<Esboco[]>([]);

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
        setErro('NÃ£o foi possÃ­vel carregar os esboÃ§os. Tente novamente mais tarde.');
      } finally {
        if (ativo) setLoading(false);
      }
    };
    carregar();
    return () => {
      ativo = false;
    };
  }, []);

  const handleIrParaBibliaOn = () => {
    window.open(getBibliaOnEsbocosIndexUrl(), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 min-h-screen">
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <header className="mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-gray-900 dark:text-white mb-3">
              EsboÃ§os de PregaÃ§Ã£o
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Aqui vocÃª encontra esboÃ§os preparados e aprovados pela lideranÃ§a da Comunidade CristÃ£ Resgate.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Para explorar muitos outros esboÃ§os de pregaÃ§Ã£o, vocÃª pode acessar diretamente o BÃ­bliaon.
            </p>
            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={handleIrParaBibliaOn}
                className="inline-flex items-center px-6 py-2.5 rounded-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold shadow-md hover:shadow-lg transition"
              >
                Ver mais esboÃ§os no BÃ­bliaon
              </button>
            </div>
          </header>

          {/* Lista de esboÃ§os */}

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
              Ainda nÃ£o hÃ¡ esboÃ§os cadastrados pela lideranÃ§a. Em breve novos conteÃºdos estarÃ£o disponÃ­veis.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    {esboco.estrutura?.introducao && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                        {esboco.estrutura.introducao}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400" />
                    <Link
                      to={`/esbocos/${esboco.id}`}
                      className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      Ver esboÃ§o completo
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


