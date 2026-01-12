import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

// Componente seguro para o ícone de fechar
const SafeXMarkIcon: React.FC<{ className?: string }> = ({ className }) => {
  if (XMarkIcon && typeof XMarkIcon === 'function') {
    const Icon = XMarkIcon as React.ComponentType<{ className?: string }>;
    return <Icon className={className} />;
  }
  return <span className={className}>✕</span>;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  // Validar props
  if (!onClose || typeof onClose !== 'function') {
    console.error('❌ Modal: onClose não é uma função válida');
    return null;
  }

  if (!title || typeof title !== 'string') {
    console.warn('⚠️ Modal: title não é uma string válida');
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title || 'Modal'}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            aria-label="Fechar"
          >
            <SafeXMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// Memoizar para evitar re-renders desnecessários
export default React.memo(Modal);
