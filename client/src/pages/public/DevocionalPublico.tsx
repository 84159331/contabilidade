import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BookOpenIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { devotionalsAPI } from '../../services/devotionalsAPI';

export default function DevocionalPublico() {
  const location = useLocation();

  const todayId = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const selectedDate = useMemo(() => {
    const q = new URLSearchParams(location.search);
    const raw = String(q.get('date') || '').trim();
    if (!raw) return todayId;
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
    return todayId;
  }, [location.search, todayId]);

  const [loading, setLoading] = useState(true);
  const [devotional, setDevotional] = useState<any | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const d = await devotionalsAPI.getByDate(selectedDate);
      setDevotional(d);
    } catch (e) {
      console.error('Erro ao carregar devocional:', e);
      toast.error('Erro ao carregar devocional');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [selectedDate]);

  return (
    <div className="py-8 sm:py-12 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpenIcon className="h-7 w-7" />
              Devocional
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              to="/devocional/historico"
              className="px-4 py-2 min-h-[44px] rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white"
            >
              Histórico
            </Link>
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="text-sm text-gray-600 dark:text-gray-400">Carregando...</div>
          ) : devotional ? (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 space-y-4">
              <div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">{devotional.title}</div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {devotional.verseRef}{devotional.verseText ? ` — ${devotional.verseText}` : ''}
                </div>
              </div>

              {devotional.imageUrl ? (
                <img
                  src={devotional.imageUrl}
                  alt={devotional.title}
                  className="w-full max-h-80 object-cover rounded-lg border border-gray-200 dark:border-gray-800"
                />
              ) : null}

              <div className="whitespace-pre-wrap text-gray-900 dark:text-gray-100 leading-relaxed">
                {devotional.body}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={load}
                  className="px-4 py-2 min-h-[44px] rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white"
                >
                  Atualizar
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
              <div className="text-gray-900 dark:text-white font-semibold">Ainda não existe devocional para esta data.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
