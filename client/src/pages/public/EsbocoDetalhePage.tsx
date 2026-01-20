import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Esboco, esbocosService } from '../../services/esbocosService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getBibliaOnEsbocosIndexUrl, getBibliaOnSearchUrl } from '../../utils/bibliaOn';

const EsbocoDetalhePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [esboco, setEsboco] = useState<Esboco | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    const carregar = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const result = await esbocosService.obterPorId(Number(id));
        if (!ativo) return;
        if (!result || result.status !== 'APROVADO') {
          setErro('Esboço não encontrado ou ainda não aprovado.');
        } else {
          setEsboco(result);
          setErro(null);
        }
      } catch (e) {
        console.error(e);
        if (!ativo) return;
        setErro('Não foi possível carregar o esboço.');
      } finally {
        if (ativo) setLoading(false);
      }
    };
    carregar();
    return () => {
      ativo = false;
    };
  }, [id]);

  const gerarLinkBibliaOn = (referencia: string) => {
    return getBibliaOnSearchUrl(referencia);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (erro || !esboco) {
    return (
      <div className="container mx-auto px-6 py-12 max-w-3xl">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {erro || 'Esboço não encontrado.'}
        </div>
        <Link
          to="/esbocos"
          className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
        >
          Voltar para lista de esboços
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 min-h-screen">
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <Link
            to="/esbocos"
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline mb-4 inline-block"
          >
            ← Voltar para esboços
          </Link>

          <header className="mb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-gray-900 dark:text-white mb-2">
              {esboco.titulo}
            </h1>
            <p className="text-primary-600 dark:text-primary-400">
              Texto base: {esboco.textoBiblicoBase}{' '}
              <a
                href={gerarLinkBibliaOn(esboco.textoBiblicoBase)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold underline ml-2"
              >
                Ler no Bíbliaon
              </a>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              {esboco.autorNome}
              {esboco.autorIgreja && ` · ${esboco.autorIgreja}`}
              {esboco.duracaoEstimadaMinutos && ` · ~${esboco.duracaoEstimadaMinutos} min`}
            </p>
          </header>

          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 space-y-6">
            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Introdução
              </h2>
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                {esboco.estrutura.introducao}
              </p>
            </section>

            {esboco.estrutura.topico1 && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Tópico 1
                </h2>
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                  {esboco.estrutura.topico1}
                </p>
              </section>
            )}

            {esboco.estrutura.topico2 && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Tópico 2
                </h2>
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                  {esboco.estrutura.topico2}
                </p>
              </section>
            )}

            {esboco.estrutura.topico3 && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Tópico 3
                </h2>
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                  {esboco.estrutura.topico3}
                </p>
              </section>
            )}

            {esboco.estrutura.topico4 && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Tópico 4
                </h2>
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                  {esboco.estrutura.topico4}
                </p>
              </section>
            )}

            {esboco.estrutura.topico5 && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Tópico 5
                </h2>
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                  {esboco.estrutura.topico5}
                </p>
              </section>
            )}

            {esboco.estrutura.topico6 && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Tópico 6
                </h2>
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                  {esboco.estrutura.topico6}
                </p>
              </section>
            )}

            {esboco.estrutura.topico7 && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Tópico 7
                </h2>
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                  {esboco.estrutura.topico7}
                </p>
              </section>
            )}

            {esboco.estrutura.topico8 && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Tópico 8
                </h2>
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                  {esboco.estrutura.topico8}
                </p>
              </section>
            )}

            {esboco.estrutura.topico9 && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Tópico 9
                </h2>
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                  {esboco.estrutura.topico9}
                </p>
              </section>
            )}

            {esboco.estrutura.conclusao && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Conclusão
                </h2>
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                  {esboco.estrutura.conclusao}
                </p>
              </section>
            )}

            {esboco.estrutura.apelo && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Apelo
                </h2>
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                  {esboco.estrutura.apelo}
                </p>
              </section>
            )}

            {esboco.referenciasAdicionais && esboco.referenciasAdicionais.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Outras referências bíblicas
                </h2>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-800 dark:text-gray-200">
                  {esboco.referenciasAdicionais.map((ref) => (
                    <li key={ref}>
                      {ref}{' '}
                      <a
                        href={gerarLinkBibliaOn(ref)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary-600 dark:text-primary-400 underline ml-1"
                      >
                        Ler no Bíbliaon
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            Dica: você pode copiar este esboço e, se desejar, buscar esboços semelhantes no Bíbliaon em{' '}
            <a
              href={getBibliaOnEsbocosIndexUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-primary-600 dark:text-primary-400"
            >
              bibliaon.com
            </a>
            .
          </div>
        </div>
      </section>
    </div>
  );
};

export default EsbocoDetalhePage;


