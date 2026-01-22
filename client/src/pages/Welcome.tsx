import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarIcon,
  ChevronRightIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../firebase/AuthContext';

export default function Welcome() {
  const { user } = useAuth();
  const name = user?.displayName || user?.email?.split('@')[0] || 'Usuário';

  const quotes = useMemo(
    () => [
      {
        theme: 'fé',
        text: 'Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz e não de mal, para vos dar um fim que esperais.',
        ref: 'Jeremias 29:11',
      },
      {
        theme: 'coragem',
        text: 'Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus; eu te esforço, e te ajudo, e te sustento com a destra da minha justiça.',
        ref: 'Isaías 41:10',
      },
      {
        theme: 'paz',
        text: 'E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos sentimentos em Cristo Jesus.',
        ref: 'Filipenses 4:7',
      },
      {
        theme: 'confiança',
        text: 'Confia no Senhor de todo o teu coração, e não te estribes no teu próprio entendimento.',
        ref: 'Provérbios 3:5',
      },
      {
        theme: 'esperança',
        text: 'Mas os que esperam no Senhor renovarão as forças, subirão com asas como águias; correrão, e não se cansarão; caminharão, e não se fatigarão.',
        ref: 'Isaías 40:31',
      },
      {
        theme: 'força',
        text: 'Tudo posso naquele que me fortalece.',
        ref: 'Filipenses 4:13',
      },
      {
        theme: 'direção',
        text: 'Entrega o teu caminho ao Senhor; confia nele, e ele o fará.',
        ref: 'Salmos 37:5',
      },
      {
        theme: 'amor',
        text: 'E disse-lhe: Amarás o Senhor teu Deus de todo o teu coração, e de toda a tua alma, e de todo o teu pensamento.',
        ref: 'Mateus 22:37',
      },
      {
        theme: 'perdão',
        text: 'E sede uns para com os outros benignos, misericordiosos, perdoando-vos uns aos outros, como também Deus vos perdoou em Cristo.',
        ref: 'Efésios 4:32',
      },
      {
        theme: 'propósito',
        text: 'E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus, daqueles que são chamados por seu decreto.',
        ref: 'Romanos 8:28',
      },
    ],
    []
  );

  const dailySeed = useMemo(() => {
    const now = new Date();
    return Number(`${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`);
  }, []);

  const startIndex = useMemo(() => dailySeed % quotes.length, [dailySeed, quotes.length]);
  const [quoteIndex, setQuoteIndex] = useState(startIndex);
  const [quoteVisible, setQuoteVisible] = useState(true);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setQuoteVisible(false);
      window.setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
        setQuoteVisible(true);
      }, 200);
    }, 12000);

    return () => window.clearInterval(interval);
  }, [quotes.length]);

  const currentQuote = quotes[quoteIndex] ?? quotes[0];

  return (
    <div className="space-y-6 pb-10 min-h-[calc(100vh-6rem)]">
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-slate-50 dark:from-gray-900 dark:to-gray-950 p-5 sm:p-6">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary-200/40 blur-3xl dark:bg-primary-700/20" />
        <div className="absolute -left-16 -bottom-20 h-56 w-56 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-700/20" />

        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Área Logada
              </div>
              <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Bem-vindo, {name}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-2xl">
                Acesse rapidamente as principais áreas.
              </p>

              <div className="mt-4 max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="rounded-xl border border-gray-200/70 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/50 px-4 py-3">
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">Acesso</div>
                    <div className="mt-0.5 text-sm text-gray-600 dark:text-gray-300">Use o menu para navegar</div>
                  </div>
                  <div className="rounded-xl border border-gray-200/70 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/50 px-4 py-3">
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">Financeiro</div>
                    <div className="mt-0.5 text-sm text-gray-600 dark:text-gray-300">Dashboard e relatórios</div>
                  </div>
                  <div className="rounded-xl border border-gray-200/70 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/50 px-4 py-3">
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">Dados</div>
                    <div className="mt-0.5 text-sm text-gray-600 dark:text-gray-300">Sincronização automática</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden sm:block text-right">
              <div className="text-xs text-gray-500 dark:text-gray-400">Conta</div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate max-w-[260px]">
                {user?.email || '—'}
              </div>
            </div>
          </div>

          <div className="mt-5" />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/40 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 via-blue-600/5 to-primary-600/10 dark:from-primary-500/10 dark:via-blue-500/5 dark:to-primary-500/10" />
        <div
          className={`relative px-5 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10 min-h-[140px] sm:min-h-[170px] md:min-h-[200px] flex flex-col items-center justify-center text-center transition-opacity duration-200 ${
            quoteVisible ? 'opacity-100' : 'opacity-0'
          }`}
          aria-live="polite"
        >
          <div className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-white leading-relaxed max-w-4xl">
            “{currentQuote.text}”
          </div>
          <div className="mt-3 text-sm sm:text-base font-medium text-gray-600 dark:text-gray-300">
            {currentQuote.ref}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Link
          to="/tesouraria/members"
          className="group rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/40 p-4 hover:bg-white dark:hover:bg-gray-900 transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center border border-primary-100 dark:border-primary-800">
              <UsersIcon className="h-5 w-5 text-primary-700 dark:text-primary-300" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-gray-900 dark:text-white">Membros</div>
                <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200" />
              </div>
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">Cadastros e gestão</div>
            </div>
          </div>
        </Link>

        <Link
          to="/tesouraria/devocional"
          className="group rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/40 p-4 hover:bg-white dark:hover:bg-gray-900 transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center border border-sky-100 dark:border-sky-800">
              <BookOpenIcon className="h-5 w-5 text-sky-700 dark:text-sky-300" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-gray-900 dark:text-white">Devocional</div>
                <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200" />
              </div>
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">Leitura diária e histórico</div>
            </div>
          </div>
        </Link>

        <Link
          to="/tesouraria/events"
          className="group rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/40 p-4 hover:bg-white dark:hover:bg-gray-900 transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center border border-blue-100 dark:border-blue-800">
              <CalendarIcon className="h-5 w-5 text-blue-700 dark:text-blue-300" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-gray-900 dark:text-white">Eventos</div>
                <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200" />
              </div>
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">Divulgação e agenda</div>
            </div>
          </div>
        </Link>

        <Link
          to="/tesouraria/scales"
          className="group rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/40 p-4 hover:bg-white dark:hover:bg-gray-900 transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center border border-emerald-100 dark:border-emerald-800">
              <ClipboardDocumentListIcon className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-gray-900 dark:text-white">Escalas</div>
                <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200" />
              </div>
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">Gestão de escalas e relatórios</div>
            </div>
          </div>
        </Link>

        <Link
          to="/tesouraria/dashboard"
          className="group rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/40 p-4 hover:bg-white dark:hover:bg-gray-900 transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center border border-amber-100 dark:border-amber-800">
              <CurrencyDollarIcon className="h-5 w-5 text-amber-700 dark:text-amber-300" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-gray-900 dark:text-white">Financeiro</div>
                <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200" />
              </div>
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">Dashboard, relatórios e transações</div>
            </div>
          </div>
        </Link>
      </div>

    </div>
  );
}
