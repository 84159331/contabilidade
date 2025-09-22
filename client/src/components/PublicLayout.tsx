import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold font-heading">
            Comunidade Cristã Resgate
          </Link>
          <div className="hidden md:flex space-x-6 items-center font-heading">
            <Link to="/sobre" className="hover:text-blue">Sobre</Link>
            <Link to="/visite" className="hover:text-blue">Visite</Link>
            <Link to="/conecte" className="hover:text-blue">Conecte-se</Link>
            <Link to="/eventos" className="hover:text-blue">Eventos</Link>
            <Link to="/assista" className="hover:text-blue">Assista</Link>
            <Link to="/contribua" className="hover:text-blue">Contribua</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/localizacoes" className="hidden md:block hover:text-blue font-heading">Localizações</Link>
            <button className="hover:text-blue">
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
            <Link to="/tesouraria/login" className="btn btn-primary">
              Tesouraria
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-black text-white pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold font-heading mb-4">Comunidade Cristã Resgate</h3>
              <p className="text-gray-light">Um lugar de fé, comunidade e transparência.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading mb-4">Navegue</h3>
              <ul className="space-y-2">
                <li><Link to="/sobre" className="hover:text-blue">Sobre</Link></li>
                <li><Link to="/visite" className="hover:text-blue">Visite</Link></li>
                <li><Link to="/conecte" className="hover:text-blue">Conecte-se</Link></li>
                <li><Link to="/eventos" className="hover:text-blue">Eventos</Link></li>
                <li><a href="http://youtube.com/@comunidadecresgate" target="_blank" rel="noopener noreferrer" className="hover:text-blue">Assista</a></li>
                <li><Link to="/contribua" className="hover:text-blue">Contribua</Link></li>
                <li><Link to="/localizacoes" className="hover:text-blue">Localizações</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading mb-4">Contato</h3>
              <p>Quadra 38, Área Especial, Lote E</p>
              <p>Vila São José, Brasília - DF, 72010-010</p>
              <p className="mt-4">contato@comunidaderesgate.com</p>
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading mb-4">Redes Sociais</h3>
              {/* Add social media icons here */}
            </div>
          </div>
          <div className="border-t border-gray-darker pt-8 text-center text-gray-dark">
            <p>&copy; {new Date().getFullYear()} Comunidade Cristã Resgate. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
