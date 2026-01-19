import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../firebase/config';
import SafeImage from '../../components/SafeImage';
import SEOHead from '../../components/SEOHead';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Mensagem é obrigatória';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Mensagem deve ter pelo menos 10 caracteres';
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
      // Tentar enviar via Firebase Functions primeiro
      try {
        const sendContactEmail = httpsCallable(functions, 'sendContactEmail');
        const result = await sendContactEmail({
          name: formData.name,
          email: formData.email,
          message: formData.message
        });

        const data = result.data as any;
        
        if (data.success) {
          toast.success(data.message || 'Mensagem enviada com sucesso! Entraremos em contato em breve.');
          setFormData({ name: '', email: '', message: '' });
          setIsSubmitting(false);
          return;
        } else {
          throw new Error(data.error || 'Erro ao enviar mensagem');
        }
      } catch (firebaseError: any) {
        console.warn('Erro ao enviar via Firebase Functions, usando fallback:', firebaseError);
        
        // Fallback: Usar mailto se Firebase Functions falhar
        const subject = encodeURIComponent(`Contato do Site - ${formData.name}`);
        const body = encodeURIComponent(
          `Nome: ${formData.name}\nEmail: ${formData.email}\n\nMensagem:\n${formData.message}`
        );
        
        toast.info('Redirecionando para seu cliente de email...');
        window.location.href = `mailto:cresgate012@gmail.com?subject=${subject}&body=${body}`;
        
        // Reset form after a delay
        setTimeout(() => {
          setFormData({ name: '', email: '', message: '' });
          setIsSubmitting(false);
        }, 2000);
      }
    } catch (error: any) {
      console.error('Erro ao enviar formulário:', error);
      toast.error(error.message || 'Erro ao enviar mensagem. Tente novamente ou envie diretamente para cresgate012@gmail.com');
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div>
      <SEOHead
        title="Contato - Comunidade Cristã Resgate"
        description="Entre em contato com a Comunidade Cristã Resgate. Estamos prontos para responder suas dúvidas e ajudar você a fazer parte da nossa família."
        keywords="contato, igreja brasília, comunidade cristã resgate, fale conosco"
        url="/contato"
      />

      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 text-center">
          <div className="mb-6">
            <SafeImage 
              src="/img/ICONE-RESGATE.png" 
              alt="Contato" 
              className="mx-auto h-20 w-20 mb-4 opacity-90"
            />
          </div>
          <h1 className="text-5xl font-bold font-heading">Contato</h1>
          <p className="text-xl mt-4 opacity-90">Estamos prontos para ajudar você</p>
        </div>
      </div>

      <div className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="mb-6">
                <SafeImage 
                  src="/img/ICONE-RESGATE.png" 
                  alt="Fale Conosco" 
                  className="h-12 w-12 mb-4"
                />
              </div>
              <h2 className="text-3xl font-bold font-heading mb-4 dark:text-white">Fale Conosco</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Preencha o formulário abaixo e entraremos em contato o mais breve possível.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Nome <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={`input ${
                      errors.name ? 'border-red-500' : ''
                    }`}
                    placeholder="Seu nome completo"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`input ${
                      errors.email ? 'border-red-500' : ''
                    }`}
                    placeholder="seu@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Mensagem <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    rows={5}
                    className={`input min-h-[120px] resize-y ${
                      errors.message ? 'border-red-500' : ''
                    }`}
                    placeholder="Sua mensagem..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Ou envie diretamente para: <a href="mailto:cresgate012@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">cresgate012@gmail.com</a>
                </p>
              </form>
            </div>
            <div>
              <div className="mb-6">
                <SafeImage 
                  src="/img/ICONE-RESGATE.png" 
                  alt="Localização" 
                  className="h-12 w-12 mb-4"
                />
              </div>
              <h2 className="text-3xl font-bold font-heading mb-4 dark:text-white">Nossa Localização</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300 mb-6">
                <div>
                  <strong className="text-gray-900 dark:text-white">Endereço:</strong>
                  <p className="mt-1">Quadra 38, Área Especial, Lote E<br />Vila São José, Brasília - DF<br />72010-010</p>
                </div>
                <div>
                  <strong className="text-gray-900 dark:text-white">Email:</strong>
                  <p className="mt-1">
                    <a href="mailto:cresgate012@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                      cresgate012@gmail.com
                    </a>
                  </p>
                </div>
              </div>
              <div className="mt-6 rounded-lg overflow-hidden shadow-lg">
                <iframe
                  title="Google Maps - Localização da Igreja"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3839.0000000000005!2d-47.99999999999999!3d-15.999999999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a2e0000000001%3A0x6f3cb501ba6f6d1!2sComunidade+Crist%C3%A3+Resgate!5e0!3m2!1spt-BR!2sbr!4v1678886434038!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
