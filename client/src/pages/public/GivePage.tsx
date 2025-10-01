import React from 'react';
import SafeImage from '../../components/SafeImage';
import { 
  CreditCardIcon, 
  QrCodeIcon, 
  DocumentTextIcon,
  CheckCircleIcon,
  HeartIcon,
  GiftIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  TruckIcon,
  ShareIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

const GivePage: React.FC = () => {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copiado para a área de transferência!`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-green-600 to-green-800 flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative z-10 text-center">
          <div className="mb-6">
            <SafeImage 
              src="/img/ICONE-RESGATE.png" 
              alt="Contribua" 
              className="mx-auto h-16 w-16 mb-4 opacity-90"
            />
          </div>
          <h1 className="text-5xl font-bold font-heading mb-4">Dízimos e Ofertas</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Temos um propósito pelo qual vivemos e caminhamos conforme uma visão que o Senhor tem nos dado
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Dados Bancários */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Dados Bancários
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Utilize os dados abaixo para fazer sua contribuição via transferência bancária
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Banco */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <CreditCardIcon className="h-6 w-6 mr-2 text-blue-600" />
                Banco
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Banco:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">Banco do Brasil</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Agência:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">1234-5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Conta:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">12345-6</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">CNPJ:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">12.345.678/0001-90</span>
                </div>
                <div className="mt-4">
                  <span className="text-gray-600 dark:text-gray-300">Favorecido:</span>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Comunidade Cristã Resgate
                  </p>
                </div>
              </div>
            </div>

            {/* PIX */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <QrCodeIcon className="h-6 w-6 mr-2 text-green-600" />
                PIX
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Chave PIX:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">12.345.678/0001-90</span>
                </div>
                <div className="mt-4">
                  <span className="text-gray-600 dark:text-gray-300">Favorecido:</span>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Comunidade Cristã Resgate
                  </p>
                </div>
                
                {/* QR Code Placeholder */}
                <div className="mt-4 text-center">
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded-lg">
                      <QrCodeIcon className="h-16 w-16 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Escaneie com seu app PIX</p>
                  </div>
                </div>
                
                <button
                  onClick={() => copyToClipboard('12.345.678/0001-90', 'Chave PIX')}
                  className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  Copiar Chave PIX
                </button>
              </div>
            </div>

            {/* Depósito em Dinheiro */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <DocumentTextIcon className="h-6 w-6 mr-2 text-purple-600" />
                Depósito em Dinheiro
              </h3>
              <div className="space-y-3">
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Você também pode fazer depósito em dinheiro diretamente em nossa conta
                  </p>
                  <div className="bg-white dark:bg-gray-600 p-4 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Horário de Funcionamento:</strong><br/>
                      Segunda a Sexta: 8h às 17h<br/>
                      Sábado: 8h às 12h<br/>
                      Domingo: Após o culto
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-gray-600 dark:text-gray-300">Local:</span>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Comunidade Cristã Resgate<br/>
                    Secretaria Administrativa
                  </p>
                </div>
                <button className="w-full mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center">
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  Mais Informações
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Informações Importantes */}
        <div className="bg-blue-50 dark:bg-blue-900 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
            <CheckCircleIcon className="h-6 w-6 mr-2" />
            Informações Importantes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-blue-800 dark:text-blue-200">
            <div>
              <h4 className="font-semibold mb-2">Como Contribuir:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Use os dados bancários para transferência</li>
                <li>• Utilize a chave PIX para pagamento instantâneo</li>
                <li>• Mantenha o comprovante para sua declaração</li>
                <li>• Contribuições são dedutíveis do IR</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Transparência:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Relatórios financeiros mensais</li>
                <li>• Prestação de contas anual</li>
                <li>• Auditoria externa regular</li>
                <li>• Uso responsável dos recursos</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Sua Contribuição Faz a Diferença
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Cada contribuição nos ajuda a continuar nossa missão de transformar vidas e 
            impactar nossa comunidade com o amor de Cristo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center">
              <HeartIcon className="h-5 w-5 mr-2" />
              Fazer Contribuição
            </button>
            <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center">
              <ShareIcon className="h-5 w-5 mr-2" />
              Compartilhar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GivePage;
