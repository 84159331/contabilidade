import React, { useState } from 'react';
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon, 
  PhotoIcon,
  ShareIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { eventsAPI } from '../services/api';
import { EventFormData } from '../types/Event';

interface EventFormProps {
  event?: EventFormData;
  onClose: () => void;
  onSave: (event: EventFormData) => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, onClose, onSave }) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date || '',
    time: event?.time || '',
    location: event?.location || '',
    image: event?.image || '',
    social_media: event?.social_media || {
      instagram: false,
      facebook: false,
      whatsapp: false
    }
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(event?.image || '');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialMediaChange = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      social_media: {
        ...prev.social_media,
        [platform]: !prev.social_media?.[platform as keyof typeof prev.social_media]
      }
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image;
      
      console.log('📝 EventForm - Iniciando submit');
      console.log('📝 EventForm - imageFile:', imageFile ? imageFile.name : 'null');
      console.log('📝 EventForm - formData.image:', formData.image ? formData.image.substring(0, 50) + '...' : 'vazio');
      
      // Upload da imagem se houver arquivo
      if (imageFile) {
        console.log('📤 EventForm - Fazendo upload da imagem...');
        console.log('📤 EventForm - Arquivo:', imageFile.name, imageFile.size, imageFile.type);
        
        try {
          imageUrl = await eventsAPI.uploadEventImage(imageFile);
          console.log('✅ EventForm - Upload concluído com sucesso');
          console.log('✅ EventForm - URL gerada:', imageUrl.substring(0, 50) + '...');
          console.log('✅ EventForm - É base64?', imageUrl.startsWith('data:'));
        } catch (uploadError) {
          console.error('❌ EventForm - Erro no upload:', uploadError);
          throw uploadError;
        }
      } else {
        console.log('ℹ️ EventForm - Nenhum arquivo para upload');
      }

      const eventData = {
        ...formData,
        image: imageUrl
      };

      console.log('💾 EventForm - Dados finais do evento:');
      console.log('💾 EventForm - Título:', eventData.title);
      console.log('💾 EventForm - Imagem:', eventData.image ? 'Sim' : 'Não');
      console.log('💾 EventForm - Imagem é base64?', eventData.image?.startsWith('data:'));
      console.log('💾 EventForm - Tamanho da imagem:', eventData.image?.length || 0);

      if (event?.id) {
        console.log('🔄 EventForm - Atualizando evento existente:', event.id);
        await eventsAPI.updateEvent(event.id, eventData);
      } else {
        console.log('➕ EventForm - Criando novo evento');
        await eventsAPI.createEvent(eventData);
      }

      console.log('✅ EventForm - Evento salvo com sucesso');
      onSave(eventData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {event?.id ? 'Editar Evento' : 'Novo Evento'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título do Evento
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Ex: Culto de Celebração"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Descreva o evento..."
            />
          </div>

          {/* Data e Hora */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <CalendarIcon className="h-4 w-4 inline mr-1" />
                Data
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <ClockIcon className="h-4 w-4 inline mr-1" />
                Horário
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>

          {/* Local */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MapPinIcon className="h-4 w-4 inline mr-1" />
              Local
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Ex: Igreja Comunidade Resgate"
              required
            />
          </div>

          {/* Upload de Imagem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <PhotoIcon className="h-4 w-4 inline mr-1" />
              Imagem do Evento
            </label>
            <div className="space-y-4">
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Redes Sociais */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ShareIcon className="h-4 w-4 inline mr-1" />
              Compartilhar nas Redes Sociais
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.social_media?.instagram || false}
                  onChange={() => handleSocialMediaChange('instagram')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Instagram</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.social_media?.facebook || false}
                  onChange={() => handleSocialMediaChange('facebook')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Facebook</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.social_media?.whatsapp || false}
                  onChange={() => handleSocialMediaChange('whatsapp')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">WhatsApp</span>
              </label>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : (event?.id ? 'Atualizar' : 'Criar Evento')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
