import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import SafeImage from '../../components/SafeImage';
import SEOHead from '../../components/SEOHead';
import { membersAPI } from '../../services/api';
import { 
  CheckCircleIcon, 
  UserPlusIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  birth_date: string;
}

const CadastroPublicoPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    birth_date: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!/^[\d\s()\-+]+$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Telefone inválido';
    }

    if (formData.birth_date && new Date(formData.birth_date) > new Date()) {
      newErrors.birth_date = 'Data de nascimento não pode ser no futuro';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar dados para o formato esperado pela API
      const memberData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim() || null,
        birth_date: formData.birth_date || null,
        status: 'active', // Status padrão para novos cadastros
        member_since: new Date().toISOString().split('T')[0], // Data atual
      };

      // Validação adicional antes de enviar
      if (!memberData.name || memberData.name.length < 3) {
        throw new Error('Nome inválido');
      }

      if (!memberData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberData.email)) {
        throw new Error('Email inválido');
      }

      console.log('📝 Cadastrando novo membro:', memberData);

      // Cadastrar automaticamente via API
      await membersAPI.createMember(memberData);

      // Mostrar mensagem de sucesso
      toast.success('🎉 Cadastro realizado com sucesso! Bem-vindo à nossa comunidade!');
      
      // Salvar nome do membro antes de limpar o formulário
      const memberName = formData.name.trim();

      // Limpar formulário
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        birth_date: ''
      });

      // Redirecionar para página de agradecimento após um breve delay
      // Passar o nome do membro para personalizar a mensagem
      setTimeout(() => {
        try {
          navigate('/cadastro/obrigado', {
            state: {
              memberName: memberName
            }
          });
        } catch (navError) {
          console.error('❌ Erro ao navegar:', navError);
          // Fallback: recarregar a página se a navegação falhar
          window.location.href = '/cadastro/obrigado';
        }
      }, 1000);

    } catch (error: any) {
      console.error('❌ Erro ao cadastrar:', error);
      
      // Tratamento de erro mais robusto
      let errorMessage = 'Erro ao realizar cadastro. Tente novamente.';
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      toast.error(`Erro: ${errorMessage}`);
      
      // Garantir que o estado seja resetado mesmo em caso de erro
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    // Resetar estado de sucesso se o usuário começar a editar novamente
    if (isSuccess) {
      setIsSuccess(false);
    }
  };

  return (
    <div>
      <SEOHead
        title="Cadastro - Comunidade Cristã Resgate"
        description="Faça parte da nossa família! Cadastre-se e seja bem-vindo à Comunidade Cristã Resgate."
        keywords="cadastro, igreja brasília, comunidade cristã resgate, membro"
        url="/cadastro"
      />

      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/50 to-purple-600/50"></div>
        </div>
        <motion.div 
          className="relative z-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6">
            <SafeImage 
              src="/img/ICONE-RESGATE.png" 
              alt="Cadastro" 
              className="mx-auto h-20 w-20 mb-4 opacity-90"
            />
          </div>
          <h1 className="text-5xl font-bold font-heading mb-4">Faça Parte da Nossa Família</h1>
          <p className="text-xl mt-4 opacity-90 max-w-2xl mx-auto">
            Cadastre-se e seja bem-vindo à Comunidade Cristã Resgate
          </p>
        </motion.div>
      </div>

      {/* Form Section */}
      <div className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Success Message */}
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-8 bg-green-50 dark:bg-green-900/30 border-2 border-green-500 rounded-lg p-6"
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="h-8 w-8 text-green-500" />
                    <div>
                      <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-1">
                        Cadastro Realizado com Sucesso! 🎉
                      </h3>
                      <p className="text-green-700 dark:text-green-300">
                        Seus dados foram registrados automaticamente em nosso sistema. 
                        Você receberá um contato em breve!
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Form Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                    <UserPlusIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold font-heading dark:text-white">
                      Formulário de Cadastro
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Preencha os dados abaixo para se cadastrar automaticamente
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nome */}
                  <div>
                    <label htmlFor="name" className="flex items-center text-gray-700 dark:text-gray-300 font-medium mb-2">
                      <UserPlusIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                      Nome Completo <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className={`input ${
                        errors.name ? 'border-red-500 ring-2 ring-red-200' : ''
                      }`}
                      placeholder="Digite seu nome completo"
                      disabled={isSubmitting}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <span className="mr-1">⚠️</span> {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="flex items-center text-gray-700 dark:text-gray-300 font-medium mb-2">
                      <EnvelopeIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                      Email <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={`input ${
                        errors.email ? 'border-red-500 ring-2 ring-red-200' : ''
                      }`}
                      placeholder="seu@email.com"
                      disabled={isSubmitting}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <span className="mr-1">⚠️</span> {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Telefone */}
                  <div>
                    <label htmlFor="phone" className="flex items-center text-gray-700 dark:text-gray-300 font-medium mb-2">
                      <PhoneIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                      Telefone <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className={`input ${
                        errors.phone ? 'border-red-500 ring-2 ring-red-200' : ''
                      }`}
                      placeholder="(61) 99999-9999"
                      disabled={isSubmitting}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <span className="mr-1">⚠️</span> {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Endereço */}
                  <div>
                    <label htmlFor="address" className="flex items-center text-gray-700 dark:text-gray-300 font-medium mb-2">
                      <MapPinIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                      Endereço
                    </label>
                    <input
                      type="text"
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      className="input"
                      placeholder="Endereço completo (opcional)"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Data de Nascimento */}
                  <div>
                    <label htmlFor="birth_date" className="flex items-center text-gray-700 dark:text-gray-300 font-medium mb-2">
                      <CalendarIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                      Data de Nascimento
                    </label>
                    <input
                      type="date"
                      id="birth_date"
                      value={formData.birth_date}
                      onChange={(e) => handleChange('birth_date', e.target.value)}
                      className={`input ${
                        errors.birth_date ? 'border-red-500 ring-2 ring-red-200' : ''
                      }`}
                      disabled={isSubmitting}
                    />
                    {errors.birth_date && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <span className="mr-1">⚠️</span> {errors.birth_date}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || isSuccess}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 min-h-[56px] rounded-lg font-semibold text-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg touch-manipulation"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Cadastrando...
                      </span>
                    ) : isSuccess ? (
                      <span className="flex items-center justify-center">
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        Cadastro Realizado!
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <UserPlusIcon className="h-5 w-5 mr-2" />
                        Cadastrar Agora
                      </span>
                    )}
                  </button>

                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Ao cadastrar, você concorda que seus dados serão armazenados em nosso sistema.
                    <br />
                    Campos marcados com <span className="text-red-500">*</span> são obrigatórios.
                  </p>
                </form>
              </div>

              {/* Info Box */}
              <div className="mt-8 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
                  ℹ️ Como funciona o cadastro automático?
                </h3>
                <p className="text-blue-800 dark:text-blue-300 text-sm">
                  Quando você preenche e envia este formulário, seus dados são automaticamente 
                  cadastrados em nosso sistema. Você receberá um contato da nossa equipe em breve 
                  para dar as boas-vindas e fornecer mais informações sobre nossa comunidade.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastroPublicoPage;