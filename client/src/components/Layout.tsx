import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../firebase/AuthContext';
import { NotificationCenter } from '../contexts/NotificationContext';
import ThemeToggle from './ThemeToggle';
import TabTransition from './TabTransition';
import { usePreloadComponents } from '../hooks/usePreloadComponents';
import { 
  HomeIcon, 
  UsersIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon, 
  TagIcon,
  ChatBubbleLeftRightIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  UserGroupIcon,
  BookOpenIcon,
  CalendarIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

// Definindo tipos para os itens de navegação para maior segurança
interface NavLink {
  type: 'link';
  name: string;
  href: string;
  icon: React.ComponentType<any>;
}

interface NavHeading {
  type: 'heading';
  name: string;
}

type NavItem = NavLink | NavHeading;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  
  // Pré-carrega componentes baseado na navegação
  usePreloadComponents();

  const navigation: NavItem[] = [
    { type: 'link', name: 'Dashboard', href: '/tesouraria/dashboard', icon: HomeIcon },
    { type: 'heading', name: 'Gerenciar' },
    { type: 'link', name: 'Transações', href: '/tesouraria/transactions', icon: CurrencyDollarIcon },
    { type: 'link', name: 'Membros', href: '/tesouraria/members', icon: UsersIcon },
    { type: 'link', name: 'Categorias', href: '/tesouraria/categories', icon: TagIcon },
    { type: 'link', name: 'Biblioteca', href: '/tesouraria/books', icon: BookOpenIcon },
    { type: 'link', name: 'Eventos', href: '/tesouraria/events', icon: CalendarIcon },
    { type: 'link', name: 'Esboços', href: '/tesouraria/esbocos', icon: DocumentTextIcon },
    { type: 'heading', name: 'Analisar' },
    { type: 'link', name: 'Relatórios', href: '/tesouraria/reports', icon: ChartBarIcon },
    { type: 'link', name: 'WhatsApp', href: '/tesouraria/whatsapp', icon: ChatBubbleLeftRightIcon },
    { type: 'heading', name: 'Administração' },
    { type: 'link', name: 'Férias Pastores', href: '/tesouraria/ferias-pastores', icon: CalendarIcon },
    { type: 'link', name: 'Células Resgate', href: '/tesouraria/cell-groups', icon: UserGroupIcon },
  ];

  const isCurrentPath = (path: string) => {
    return location.pathname === path;
  };

  // Função de renderização corrigida
  const renderNav = () => {
    return navigation.map((item) => {
      if (item.type === 'link') {
        const Icon = item.icon; // O ícone é atribuído a uma variável com letra maiúscula
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={() => setSidebarOpen(false)}
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
              isCurrentPath(item.href)
                ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
            }`}
          >
            <Icon className="mr-3 h-5 w-5" />
            {item.name}
          </Link>
        );
      }
      // Renderiza o subtítulo
      return (
        <div key={item.name} className="pt-6 pb-2 px-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider dark:text-gray-500">
            {item.name}
          </h3>
        </div>
      );
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-72 flex-col bg-white dark:bg-gray-900">
          <div className="flex h-16 items-center justify-between px-4">
            <a 
              href="https://www.instagram.com/comunidadecresgate/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-x-3 group"
            >
              <img 
              src="/img/ICONE-RESGATE.png" 
              alt="Resgate" 
              className="h-6 w-6 group-hover:opacity-80 transition-opacity"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
              <h1 className="text-lg font-bold text-gray-700 group-hover:text-primary-600 transition-colors dark:text-gray-300 dark:group-hover:text-primary-400">
                Tesouraria Resgate
              </h1>
            </a>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {renderNav()}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white/95 backdrop-blur-sm border-r border-gray-100 dark:bg-gray-900/95 dark:border-gray-800 shadow-sm">
          <a 
            href="https://www.instagram.com/comunidadecresgate/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex h-16 items-center gap-x-3 px-4 group"
          >
            <img 
              src="/img/ICONE-RESGATE.png" 
              alt="Resgate" 
              className="h-6 w-6 group-hover:opacity-80 transition-opacity"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <h1 className="text-lg font-bold text-gray-700 group-hover:text-primary-600 transition-colors dark:text-gray-300 dark:group-hover:text-primary-400">
              Tesouraria Resgate
            </h1>
          </a>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {renderNav()}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-2 border-b border-gray-100 bg-white/80 backdrop-blur-sm px-3 shadow-sm sm:gap-x-4 sm:px-4 lg:gap-x-6 lg:px-8 dark:border-gray-800 dark:bg-gray-900/80">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden dark:text-gray-300"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-2 self-stretch sm:gap-x-4 lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-2 sm:gap-x-4 lg:gap-x-6">
              <NotificationCenter />
              <ThemeToggle />
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:bg-gray-700" />
              <div className="flex items-center gap-x-1 sm:gap-x-2">
                <span className="hidden sm:inline text-sm text-gray-700 dark:text-gray-300">
                  Olá, {user?.displayName || user?.email?.split('@')[0] || 'Usuário'}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-x-1 text-sm text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-4 sm:py-6">
          <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
            <TabTransition transitionKey={location.pathname}>
              <div className="bg-white/90 dark:bg-gray-900/90 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm sm:shadow-md p-4 sm:p-6 lg:p-8">
                {children}
              </div>
            </TabTransition>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;