import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import ThemeToggle from './ThemeToggle';
import SafeImage from './SafeImage';
import SearchModal from './SearchModal';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

const FaFacebookIcon = FaFacebook as any;
const FaInstagramIcon = FaInstagram as any;
const FaYoutubeIcon = FaYoutube as any;

const PublicLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navigationLinks = [
    { to: '/sobre', label: 'Sobre' },
    { to: '/conecte', label: 'Conecte-se' },
    { to: '/assista', label: 'Assista' },
    { to: '/contribua', label: 'Contribua' },
    { to: '/localizacoes', label: 'Localização' },
    { to: '/esbocos', label: 'Esboços' },
    { to: '/eventos', label: 'Eventos' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 transition-colors duration-300">
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center hover:opacity-80 transition-opacity"
              title="Voltar à página inicial"
              onClick={closeMobileMenu}
            >
              <SafeImage 
                src="/img/ICONE-RESGATE.png" 
                alt="Comunidade Cristã Resgate" 
                className="h-10 w-10"
              />
            </Link>

            {/* Desktop Navigation Menu */}
            <nav className="hidden md:flex space-x-8 items-center font-heading">
              {navigationLinks.map((link) => (
                <Link 
                  key={link.to}
                  to={link.to} 
                  className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSearchOpen(true)}
                className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors" 
                title="Buscar"
                aria-label="Buscar"
              >
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>
              <ThemeToggle />
              <a 
                href="/tesouraria/login" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hidden sm:inline-block bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Tesouraria
              </a>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
              <nav className="flex flex-col space-y-2 pt-4">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={closeMobileMenu}
                    className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-heading"
                  >
                    {link.label}
                  </Link>
                ))}
                <a
                  href="/tesouraria/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobileMenu}
                  className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors text-center"
                >
                  Tesouraria
                </a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Search Modal */}
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-gray-300 pt-16 pb-8 dark:bg-black">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <img 
                  src="/img/ICONE-RESGATE.png" 
                  alt="Resgate" 
                  className="h-8 w-8 mr-3"
                />
                <h3 className="text-xl font-bold font-heading text-white">Comunidade Cristã Resgate</h3>
              </div>
              <p className="text-gray-400">Um lugar de fé, comunidade e transparência.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading mb-4 text-white">Navegue</h3>
              <ul className="space-y-2">
                <li><Link to="/sobre" className="hover:text-primary-400">Sobre</Link></li>
                <li><Link to="/conecte" className="hover:text-primary-400">Conecte-se</Link></li>
                <li><a href="https://youtube.com/@comunidadecresgate" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400">Assista</a></li>
                <li><Link to="/contribua" className="hover:text-primary-400">Contribua</Link></li>
                <li><Link to="/localizacoes" className="hover:text-primary-400">Localização</Link></li>
                <li><Link to="/esbocos" className="hover:text-primary-400">Esboços de Pregação</Link></li>
                <li><Link to="/eventos" className="hover:text-primary-400">Eventos</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading mb-4 text-white">Contato</h3>
              <p>Quadra 38, Área Especial, Lote E</p>
              <p>Vila São José, Brasília - DF, 72010-010</p>
              <p className="mt-4">cresgate012@gmail.com</p>
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading mb-4 text-white">Redes Sociais</h3>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/comunidadecresgate/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-primary-400">
                  <FaFacebookIcon className="h-6 w-6" />
                </a>
                <a href="https://www.instagram.com/comunidadecresgate/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-primary-400">
                  <FaInstagramIcon className="h-6 w-6" />
                </a>
                <a href="https://youtube.com/@comunidadecresgate" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-primary-400">
                  <FaYoutubeIcon className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} Comunidade Cristã Resgate. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
