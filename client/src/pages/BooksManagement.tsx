import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AddBookModal from '../components/AddBookModal';
import { 
  BookOpenIcon, 
  MagnifyingGlassIcon, 
  DocumentArrowDownIcon,
  EyeIcon,
  CalendarIcon,
  StarIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface Livro {
  id: string;
  titulo: string;
  autor: string;
  descricao: string;
  categoria: string;
  capa: string;
  pdfUrl: string;
  tamanho: string;
  paginas: number;
  ano: number;
  tags: string[];
  downloads: number;
  avaliacao: number;
  isNovo?: boolean;
  isDestaque?: boolean;
}

const categorias = [
  'Todos',
  'Teologia',
  'Devocionais',
  'Estudos Bíblicos',
  'Fé',
  'Esperança',
  'Palavras de Coach',
  'Palavras de Esperança',
  'Biografias',
  'História da Igreja',
  'Liderança',
  'Família',
  'Jovens',
  'Crianças'
];

const BooksManagement: React.FC = () => {
  const [livrosLista, setLivrosLista] = useState<Livro[]>(() => {
    // Carregar livros salvos do localStorage
    const livrosSalvos = localStorage.getItem('biblioteca-livros');
    return livrosSalvos ? JSON.parse(livrosSalvos) : [];
  });
  const [livrosFiltrados, setLivrosFiltrados] = useState<Livro[]>(livrosLista);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todos');
  const [termoBusca, setTermoBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState('destaque');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    filtrarLivros();
  }, [categoriaSelecionada, termoBusca, ordenacao, livrosLista]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtrarLivros = () => {
    let resultado = livrosLista;

    // Filtrar por categoria
    if (categoriaSelecionada !== 'Todos') {
      resultado = resultado.filter(livro => livro.categoria === categoriaSelecionada);
    }

    // Filtrar por termo de busca
    if (termoBusca) {
      resultado = resultado.filter(livro => 
        livro.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
        livro.autor.toLowerCase().includes(termoBusca.toLowerCase()) ||
        livro.tags.some(tag => tag.toLowerCase().includes(termoBusca.toLowerCase()))
      );
    }

    // Ordenar
    switch (ordenacao) {
      case 'destaque':
        resultado = resultado.sort((a, b) => {
          if (a.isDestaque && !b.isDestaque) return -1;
          if (!a.isDestaque && b.isDestaque) return 1;
          return b.avaliacao - a.avaliacao;
        });
        break;
      case 'titulo':
        resultado = resultado.sort((a, b) => a.titulo.localeCompare(b.titulo));
        break;
      case 'autor':
        resultado = resultado.sort((a, b) => a.autor.localeCompare(b.autor));
        break;
      case 'downloads':
        resultado = resultado.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'avaliacao':
        resultado = resultado.sort((a, b) => b.avaliacao - a.avaliacao);
        break;
    }

    setLivrosFiltrados(resultado);
  };

  const handleAddBook = (novoLivro: Livro) => {
    setLivrosLista(prev => {
      const novaLista = [novoLivro, ...prev];
      // Salvar no localStorage
      localStorage.setItem('biblioteca-livros', JSON.stringify(novaLista));
      return novaLista;
    });
    setShowAddModal(false);
  };

  const handleDeleteBook = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este livro?')) {
      setLivrosLista(prev => {
        const novaLista = prev.filter(livro => livro.id !== id);
        localStorage.setItem('biblioteca-livros', JSON.stringify(novaLista));
        return novaLista;
      });
    }
  };

  const handleToggleDestaque = (id: string) => {
    setLivrosLista(prev => {
      const novaLista = prev.map(livro => 
        livro.id === id ? { ...livro, isDestaque: !livro.isDestaque } : livro
      );
      localStorage.setItem('biblioteca-livros', JSON.stringify(novaLista));
      return novaLista;
    });
  };

  const handleClearLibrary = () => {
    if (window.confirm('Tem certeza que deseja limpar toda a biblioteca? Esta ação não pode ser desfeita.')) {
      setLivrosLista([]);
      localStorage.removeItem('biblioteca-livros');
      alert('Biblioteca limpa com sucesso!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Gerenciamento de Livros
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Gerencie a biblioteca digital da igreja
              </p>
            </div>
            <div className="flex gap-3">
              {livrosLista.length > 0 && (
                <button
                  onClick={handleClearLibrary}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center"
                >
                  <TrashIcon className="h-5 w-5 mr-2" />
                  Limpar Biblioteca
                </button>
              )}
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Adicionar Livro
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por título, autor ou palavra-chave..."
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Categoria */}
            <div className="lg:w-48">
              <select
                value={categoriaSelecionada}
                onChange={(e) => setCategoriaSelecionada(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {categorias.map(categoria => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </select>
            </div>

            {/* Ordenação */}
            <div className="lg:w-48">
              <select
                value={ordenacao}
                onChange={(e) => setOrdenacao(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="destaque">Destaques</option>
                <option value="titulo">Título A-Z</option>
                <option value="autor">Autor A-Z</option>
                <option value="downloads">Mais Baixados</option>
                <option value="avaliacao">Melhor Avaliados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <BookOpenIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Livros</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{livrosLista.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <DocumentArrowDownIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Downloads</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {livrosLista.reduce((total, livro) => total + livro.downloads, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <StarIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Livros em Destaque</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {livrosLista.filter(livro => livro.isDestaque).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Novos Este Ano</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {livrosLista.filter(livro => livro.ano === new Date().getFullYear()).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de Livros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {livrosFiltrados.map((livro, index) => (
            <motion.div
              key={livro.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Capa */}
              <div className="relative">
                <img 
                  src={livro.capa} 
                  alt={livro.titulo}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/img/placeholder-book.jpg';
                  }}
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {livro.isDestaque && (
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Destaque
                    </span>
                  )}
                  {livro.isNovo && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Novo
                    </span>
                  )}
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-black/70 text-white px-2 py-1 rounded text-sm">
                    {livro.categoria}
                  </span>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {livro.titulo}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  por <span className="font-semibold">{livro.autor}</span>
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                  {livro.descricao}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {livro.tags.slice(0, 3).map(tag => (
                    <span 
                      key={tag}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Informações */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>{livro.ano}</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpenIcon className="h-4 w-4 mr-1" />
                    <span>{livro.paginas} págs</span>
                  </div>
                  <div className="flex items-center">
                    <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                    <span>{livro.tamanho}</span>
                  </div>
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 mr-1" />
                    <span>{livro.avaliacao}</span>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-2">
                  <button
                    onClick={() => window.open(livro.pdfUrl, '_blank')}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <EyeIcon className="h-5 w-5 mr-2" />
                    Visualizar
                  </button>
                  <button
                    onClick={() => handleToggleDestaque(livro.id)}
                    className={`py-2 px-4 rounded-lg font-semibold transition-colors ${
                      livro.isDestaque 
                        ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                    title={livro.isDestaque ? 'Remover destaque' : 'Adicionar destaque'}
                  >
                    <StarIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteBook(livro.id)}
                    className="bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    title="Excluir livro"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mensagem quando não há resultados */}
        {livrosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <BookOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {livrosLista.length === 0 ? 'Nenhum livro cadastrado' : 'Nenhum livro encontrado'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {livrosLista.length === 0 
                ? 'Comece adicionando livros à biblioteca digital'
                : 'Tente ajustar os filtros ou termo de busca'
              }
            </p>
            {livrosLista.length === 0 && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center mx-auto"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Adicionar Primeiro Livro
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal para Adicionar Livro */}
      <AddBookModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddBook={handleAddBook}
      />
    </div>
  );
};

export default BooksManagement;
