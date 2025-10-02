import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeImage from '../../components/SafeImage';
import AddBookModal from '../../components/AddBookModal';
import { 
  BookOpenIcon, 
  MagnifyingGlassIcon, 
  DocumentArrowDownIcon,
  EyeIcon,
  CalendarIcon,
  StarIcon,
  PlusIcon
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
  'Biografias',
  'História da Igreja',
  'Liderança',
  'Família',
  'Jovens',
  'Crianças'
];

const livros: Livro[] = [
  {
    id: '1',
    titulo: 'A Bíblia de Estudo Pentecostal',
    autor: 'Donald C. Stamps',
    descricao: 'Uma das mais completas Bíblias de estudo com comentários pentecostais, notas explicativas e referências cruzadas.',
    categoria: 'Teologia',
    capa: '/img/biblia-pentecostal.jpg',
    pdfUrl: '/pdfs/biblia-pentecostal.pdf',
    tamanho: '45.2 MB',
    paginas: 2048,
    ano: 2020,
    tags: ['Bíblia', 'Estudo', 'Pentecostal', 'Comentários'],
    downloads: 1250,
    avaliacao: 4.9,
    isDestaque: true
  },
  {
    id: '2',
    titulo: 'O Peregrino',
    autor: 'John Bunyan',
    descricao: 'Clássico da literatura cristã que narra a jornada espiritual de Cristão em busca da Cidade Celestial.',
    categoria: 'Devocionais',
    capa: '/img/o-peregrino.jpg',
    pdfUrl: '/pdfs/o-peregrino.pdf',
    tamanho: '12.8 MB',
    paginas: 320,
    ano: 1678,
    tags: ['Clássico', 'Jornada', 'Espiritual', 'Alegoria'],
    downloads: 890,
    avaliacao: 4.8,
    isNovo: true
  },
  {
    id: '3',
    titulo: 'A Vida de Cristo',
    autor: 'Fulton J. Sheen',
    descricao: 'Profunda reflexão sobre a vida, morte e ressurreição de Jesus Cristo, com insights teológicos únicos.',
    categoria: 'Teologia',
    capa: '/img/vida-cristo.jpg',
    pdfUrl: '/pdfs/vida-cristo.pdf',
    tamanho: '28.5 MB',
    paginas: 650,
    ano: 1958,
    tags: ['Cristo', 'Teologia', 'Reflexão', 'Biografia'],
    downloads: 756,
    avaliacao: 4.7
  },
  {
    id: '4',
    titulo: 'Oração: A Chave do Avivamento',
    autor: 'E. M. Bounds',
    descricao: 'Clássico sobre a importância da oração no avivamento espiritual e na vida cristã.',
    categoria: 'Devocionais',
    capa: '/img/oracao-avivamento.jpg',
    pdfUrl: '/pdfs/oracao-avivamento.pdf',
    tamanho: '8.3 MB',
    paginas: 180,
    ano: 1927,
    tags: ['Oração', 'Avivamento', 'Espiritual', 'Crescimento'],
    downloads: 634,
    avaliacao: 4.6
  },
  {
    id: '5',
    titulo: 'Estudos no Sermão do Monte',
    autor: 'D. Martyn Lloyd-Jones',
    descricao: 'Análise profunda e prática do mais famoso sermão de Jesus, com aplicações para a vida cristã.',
    categoria: 'Estudos Bíblicos',
    capa: '/img/sermao-monte.jpg',
    pdfUrl: '/pdfs/sermao-monte.pdf',
    tamanho: '22.1 MB',
    paginas: 480,
    ano: 1959,
    tags: ['Sermão', 'Monte', 'Estudo', 'Prático'],
    downloads: 542,
    avaliacao: 4.8
  },
  {
    id: '6',
    titulo: 'A História da Igreja Cristã',
    autor: 'Earle E. Cairns',
    descricao: 'Completa história da igreja desde os tempos apostólicos até os dias atuais.',
    categoria: 'História da Igreja',
    capa: '/img/historia-igreja.jpg',
    pdfUrl: '/pdfs/historia-igreja.pdf',
    tamanho: '35.7 MB',
    paginas: 720,
    ano: 1996,
    tags: ['História', 'Igreja', 'Cristianismo', 'Apostólico'],
    downloads: 423,
    avaliacao: 4.5
  }
];

const BibliotecaPage: React.FC = () => {
  const [livrosLista, setLivrosLista] = useState<Livro[]>(livros);
  const [livrosFiltrados, setLivrosFiltrados] = useState<Livro[]>(livros);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todos');
  const [termoBusca, setTermoBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState('destaque');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    filtrarLivros();
  }, [categoriaSelecionada, termoBusca, ordenacao]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleDownload = (livro: Livro) => {
    // Simular download
    const link = document.createElement('a');
    link.href = livro.pdfUrl;
    link.download = `${livro.titulo}.pdf`;
    link.click();
    
    // Atualizar contador de downloads
    setLivrosLista(prev => prev.map(l => 
      l.id === livro.id ? { ...l, downloads: l.downloads + 1 } : l
    ));
    
    // eslint-disable-next-line no-console
    console.log(`Download iniciado: ${livro.titulo}`);
  };

  const handleAddBook = (novoLivro: Livro) => {
    setLivrosLista(prev => [novoLivro, ...prev]);
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SafeImage 
              src="/img/ICONE-RESGATE.png" 
              alt="Biblioteca Digital" 
              className="mx-auto h-16 w-16 mb-6 opacity-90"
            />
            <h1 className="text-5xl font-bold font-heading mb-4">Biblioteca Digital</h1>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Acesse uma vasta coleção de livros cristãos, estudos bíblicos e recursos espirituais
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center">
                <BookOpenIcon className="h-5 w-5 mr-2" />
                <span>{livrosLista.length} Livros Disponíveis</span>
              </div>
              <div className="flex items-center">
                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                <span>Download Gratuito</span>
              </div>
              <div className="flex items-center">
                <StarIcon className="h-5 w-5 mr-2" />
                <span>Recursos Selecionados</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Catálogo de Livros
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Adicionar Livro
          </button>
        </div>
        
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
              {/* Badges */}
              <div className="relative">
                <SafeImage 
                  src={livro.capa} 
                  alt={livro.titulo}
                  className="w-full h-64 object-cover"
                  fallbackText="Capa do Livro"
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

                {/* Botões */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(livro)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                    Baixar
                  </button>
                  <button className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    <EyeIcon className="h-5 w-5" />
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
              Nenhum livro encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Tente ajustar os filtros ou termo de busca
            </p>
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

export default BibliotecaPage;
