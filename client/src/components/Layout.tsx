import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  HomeIcon, 
  UsersIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon, 
  TagIcon,
  ShieldCheckIcon, // Adicionado
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  UserGroupIcon
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

  const navigation: NavItem[] = [
    { type: 'link', name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { type: 'heading', name: 'Gerenciar' },
    { type: 'link', name: 'Transações', href: '/transactions', icon: CurrencyDollarIcon },
    { type: 'link', name: 'Membros', href: '/members', icon: UsersIcon },
    { type: 'link', name: 'Categorias', href: '/categories', icon: TagIcon },
    { type: 'heading', name: 'Analisar' },
    { type: 'link', name: 'Relatórios', href: '/reports', icon: ChartBarIcon },
    { type: 'heading', name: 'Administração' },
    { type: 'link', name: 'Usuários', href: '/users', icon: ShieldCheckIcon },
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
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              isCurrentPath(item.href)
                ? 'bg-primary-100 text-primary-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {item.name}
          </h3>
        </div>
      );
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-green-200">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-72 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <a 
              href="https://www.instagram.com/comunidadecresgate/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-x-3 group"
            >
              <UserGroupIcon className="h-6 w-6 text-gray-400 group-hover:text-primary-600 transition-colors" />
              <h1 className="text-lg font-bold text-gray-700 group-hover:text-primary-600 transition-colors">
                Tesouraria Resgate
              </h1>
            </a>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
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
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <a 
            href="https://www.instagram.com/comunidadecresgate/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex h-16 items-center gap-x-3 px-4 group"
          >
            <UserGroupIcon className="h-6 w-6 text-gray-400 group-hover:text-primary-600 transition-colors" />
            <h1 className="text-lg font-bold text-gray-700 group-hover:text-primary-600 transition-colors">
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
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white/60 backdrop-blur-sm px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />
              <div className="flex items-center gap-x-2">
                <span className="text-sm text-gray-700">Olá, {user?.username}</span>
                <button
                  onClick={logout}
                  className="flex items-center gap-x-2 text-sm text-gray-700 hover:text-gray-900"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;