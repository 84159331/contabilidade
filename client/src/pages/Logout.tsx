import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const Logout: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-blue-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl text-center">
        <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Você saiu com segurança!
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Sua sessão foi encerrada. Esperamos ver você novamente em breve.
        </p>
        <div>
          <Link
            to="/login"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mt-6"
          >
            Ir para o Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Logout;
