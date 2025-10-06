import { useState, useEffect } from 'react';
import { Upload, X, Plus, Calendar, Type, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';

const EditEventForm = ({ onSubmit, onCancel }) => {
  const [event, setEvent] = useState();
  const [formData, setFormData] = useState({
    name: '',
    date_event: '',
    description: '',
    principal_photo: 0
  });

  const [dateError, setDateError]= useState(false)
  const [loading, setLoading] = useState(true);
  const API_BASE = 'http://localhost:3472';
  const id = window.location.pathname.split("/")[2];

  const [existingImages, setExistingImages] = useState([]); // imagens já salvas
  const [removedImages, setRemovedImages] = useState([]);   // imagens removidas
  const [imageFiles, setImageFiles] = useState([]);         // novas imagens
  const [imagePreviews, setImagePreviews] = useState([]);   // URLs de preview
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getImageUrl = (relativePath) => `${API_BASE}${relativePath.replace('.', '')}`;

  // Carregar evento
  const loadEvent = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/${id}`);
      const data = await response.json();
      setEvent(data);
    } catch (error) {
      console.error('Erro ao carregar evento:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvent();
  }, []);

  // Preenche form e imagens existentes quando o evento é carregado
  useEffect(() => {
    if (event) {
      const dateEventArr = event.date_event.split('-')
      const year = dateEventArr[0]
      const month = dateEventArr[1]
      const day = dateEventArr[2]
      const formatedDate = `${year}-${month}-${day}`

      setFormData({
        name: event.name || '',
        date_event: formatedDate || '',
        description: event.description || '',
        principal_photo: event.principal_photo || 0
      });

      const urls = event.images?.map(img => getImageUrl(img)) || [];
      setExistingImages(event.images || []);
      setImagePreviews(urls);
    }
  }, [event]);

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date
  };

  // Atualiza campos de texto
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if(name === 'date_event' && (formatDate(value).getFullYear() < new Date().getFullYear() - 100  || formatDate(value) > new Date())){
      setDateError(true)
    }
    else{
      setDateError(false)
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Adiciona novas imagens
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
        setImageFiles(prev => [...prev, file]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove imagem (pode ser existente ou nova)
  const removeImage = (index) => {
    const totalExisting = existingImages.length;

    if (index < totalExisting) {
      // Está removendo uma imagem antiga
      const removed = existingImages[index];
      setRemovedImages(prev => [...prev, removed]);
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      // Está removendo uma imagem nova
      const newIndex = index - totalExisting;
      setImageFiles(prev => prev.filter((_, i) => i !== newIndex));
    }

    // Remove do preview geral
    setImagePreviews(prev => prev.filter((_, i) => i !== index));

    if (formData.principal_photo === index) {
      setFormData(prev => ({ ...prev, principal_photo: 0 }));
    } else if (formData.principal_photo > index) {
      setFormData(prev => ({ ...prev, principal_photo: prev.principal_photo - 1 }));
    }
  };

  const setMainImage = (index) => {
    setFormData(prev => ({ ...prev, principal_photo: index }));
  };

  // Enviar alterações
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('id', id);
      data.append('name', formData.name);
      data.append('description', formData.description || '');
      data.append('date_event', formData.date_event);
      data.append('principal_photo', String(formData.principal_photo ?? 0));

      // Novas imagens
      imageFiles.forEach(file => {
        data.append('images', file);
      });

      // Imagens antigas removidas
      removedImages.forEach(img => {
        data.append('removedImages', img);
      });

      await onSubmit(data);

      alert('Evento atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      alert('Erro ao atualizar evento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card rounded-xl shadow-lg border border-border p-6 max-w-3xl mx-auto"
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground text-lg">Carregando evento...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Nome */}
          <div className="space-y-2">
            <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Type className="w-4 h-4" /> Nome do Evento
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Data */}
          <div className="space-y-2">
            <label htmlFor="date_event" className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Calendar className="w-4 h-4" /> Data do Evento
            </label>
            <input
              type="date"
              id="date_event"
              name="date_event"
              value={formData.date_event}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Type className="w-4 h-4" /> Descrição
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descreva o evento..."
              rows="4"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Upload de Imagens */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <ImageIcon className="w-4 h-4" /> Imagens do Evento
            </label>

            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <label htmlFor="images" className="cursor-pointer flex flex-col items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-foreground font-medium">Clique para fazer upload</p>
                  <p className="text-sm text-muted-foreground">PNG, JPG, WEBP até 10MB</p>
                </div>
              </label>
            </div>

            {/* Preview das Imagens */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {imagePreviews.map((preview, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group"
                  >
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className={`w-full h-32 object-cover rounded-lg border-2 transition-all ${
                        formData.principal_photo === index
                          ? 'border-primary shadow-lg'
                          : 'border-border'
                      }`}
                    />

                    {formData.principal_photo === index && (
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
                        Principal
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      {formData.principal_photo !== index && (
                        <button
                          type="button"
                          onClick={() => setMainImage(index)}
                          className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90"
                          title="Definir como principal"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-2 bg-destructive text-white rounded-full hover:bg-destructive/90"
                        title="Remover imagem"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting || dateError} className="flex-1">
              {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          </div>
        </form>
      )}
    </motion.div>
  );
};

export default EditEventForm;
