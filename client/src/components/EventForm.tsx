import React, { useRef, useState } from 'react';
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
  const [imageFileName, setImageFileName] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
      setImageFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePickImage = () => {
    fileInputRef.current?.click();
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImageFileName('');
    setImagePreview('');
    setFormData((prev) => ({
      ...prev,
      image: '',
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image;
      
      console.log('ðŸ“ EventForm - Iniciando submit');
      console.log('ðŸ“ EventForm - imageFile:', imageFile ? imageFile.name : 'null');
      console.log('ðŸ“ EventForm - formData.image:', formData.image ? formData.image.substring(0, 50) + '...' : 'vazio');
      
      // Upload da imagem se houver arquivo
      if (imageFile) {
        console.log('ðŸ“¤ EventForm - Fazendo upload da imagem...');
        console.log('ðŸ“¤ EventForm - Arquivo:', imageFile.name, imageFile.size, imageFile.type);
        
        try {
          imageUrl = await eventsAPI.uploadEventImage(imageFile);
          console.log('âœ… EventForm - Upload concluÃ­do com sucesso');
          console.log('âœ… EventForm - URL gerada:', imageUrl.substring(0, 50) + '...');
          console.log('âœ… EventForm - Ã‰ base64?', imageUrl.startsWith('data:'));
        } catch (uploadError) {
          console.error('âŒ EventForm - Erro no upload:', uploadError);
          throw uploadError;
        }
      } else {
        console.log('â„¹ï¸ EventForm - Nenhum arquivo para upload');
      }

      const eventData = {
        ...formData,
        image: imageUrl
      };

      console.log('ðŸ’¾ EventForm - Dados finais do evento:');
      console.log('ðŸ’¾ EventForm - Título:', eventData.title);
      console.log('ðŸ’¾ EventForm - Imagem:', eventData.image ? 'Sim' : 'Não');
      console.log('ðŸ’¾ EventForm - Imagem é base64?', eventData.image?.startsWith('data:'));
      console.log('ðŸ’¾ EventForm - Tamanho da imagem:', eventData.image?.length || 0);

      if (event?.id) {
        console.log('ðŸ”„ EventForm - Atualizando evento existente:', event.id);
        await eventsAPI.updateEvent(event.id, eventData);
      } else {
        console.log('âž• EventForm - Criando novo evento');
        await eventsAPI.createEvent(eventData);
      }

      console.log('âœ… EventForm - Evento salvo com sucesso');
      onSave(eventData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white dark:bg-gray-800 shadow-xl w-full h-full sm:h-auto sm:max-w-2xl sm:max-h-[90vh] sm:rounded-lg flex flex-col">
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {event?.id ? 'Editar Evento' : 'Novo Evento'}
          </h2>
          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form id="event-form" onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
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
                HorÃ¡rio
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="absolute top-2 right-2 px-3 py-1 rounded-md bg-black/60 text-white text-xs"
                  >
                    Remover
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handlePickImage}
                  className="w-full sm:w-auto px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Selecionar imagem
                </button>
                <div className="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200">
                  {imageFileName ? imageFileName : imagePreview ? 'Imagem selecionada' : 'Nenhuma imagem selecionada'}
                </div>
              </div>
            </div>
          </div>

          {/* Redes Sociais */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <ShareIcon className="h-4 w-4 inline mr-1" />
              Compartilhar nas Redes Sociais
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.social_media?.instagram || false}
                  onChange={() => handleSocialMediaChange('instagram')}
                  className="mr-2 h-5 w-5"
                />
                <span className="text-sm text-gray-700 dark:text-gray-200">Instagram</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.social_media?.facebook || false}
                  onChange={() => handleSocialMediaChange('facebook')}
                  className="mr-2 h-5 w-5"
                />
                <span className="text-sm text-gray-700 dark:text-gray-200">Facebook</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.social_media?.whatsapp || false}
                  onChange={() => handleSocialMediaChange('whatsapp')}
                  className="mr-2 h-5 w-5"
                />
                <span className="text-sm text-gray-700 dark:text-gray-200">WhatsApp</span>
              </label>
            </div>
          </div>

          {/* BotÃµes */}
        </form>

        <div className="sticky bottom-0 z-10 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="event-form"
              disabled={loading}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : (event?.id ? 'Atualizar' : 'Criar Evento')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
