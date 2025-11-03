import { useState, useEffect } from 'react';
import { Upload, X, Plus, Calendar, Type, Image as ImageIcon, FileText, Loader2,ListChecks } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { groupAPI } from '@/services/api.js';

const EditEventForm = ({ onSubmit, onCancel }) => {

  // Setando states padrão para o formulário
  const [event, setEvent] = useState();
  const [formData, setFormData] = useState({
    name: '',
    date_event: '',
    description: '',
    principal_photo: 0,
    group_id: ''
  });
  const [dateError, setDateError]= useState(false)
  const [loading, setLoading] = useState(true);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [existingDocuments, setExistingDocuments] = useState([]);
  const [removedDocuments, setRemovedDocuments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [allGroups, setAllGroups] = useState([]);

  // Variáveis estáticas para requisições posteriores
  const API_BASE = 'http://localhost:3472';
  const id = window.location.pathname.split("/")[3];

  // useEffect para busca de grupos válidos, os quais não tenham sido inclusos para deletion, ou seja onde date_deletion é null
  useEffect(() => {
      const fetchGroups = async () => {
        try {
          const res = await groupAPI.getAllGroups();
          const filtered = res.filter((e) => !e.date_deletion);
          setAllGroups(filtered);
        } catch (err) {
          console.error('Erro ao buscar grupos:', err);
        } finally {
          setLoadingGroups(false);
        }
      };
      fetchGroups();
    }, []);

  /* Função auxiliar para formatação de data, para inclusão no input, pois o padrão recebido UTC do MYSQL não se encaixa diretamente no valor 
  que o input aceita*/
  const formatDateNum = (dateToConvert) => {
    const date = new Date(dateToConvert)
    const formatedDate =  date.toLocaleDateString('sv-SE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
    return formatedDate
  }

  // Função auxiliar para busca do caminho da imagem
  const getImageUrl = (relativePath) => `${API_BASE}${relativePath.replace('.', '')}`;

  // Método para carregamento dos dados do evento
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

  // useEffect para carregamento dos dados do evento
  useEffect(() => {
    loadEvent();
  }, []);

  // useEffect para inclusão dos dados do evento recebidos nos campos do input
  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name || '',
        date_event: formatDateNum(event.date_event) || '',
        description: event.description || '',
        principal_photo: event.principal_photo || 0,
        group_id: event.group_id || ''
      });

      const urls = event.images?.map(img => getImageUrl(img)) || [];
      setExistingImages(event.images || []);
      setImagePreviews(urls);

      // Carregar documentos existentes (se o backend retornar)
      setExistingDocuments(event.documents || []);
    }
  }, [event]);

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    console.log(`${year} ${month} ${day}`)
    return new Date(year, month - 1, day);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if(name === 'date_event' && (formatDate(value).getFullYear() < new Date().getFullYear() - 100 || formatDate(value) > new Date())){
      setDateError(true);
    } else {
      setDateError(false);
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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

  // --- NOVO: upload de documentos ---
  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    setDocumentFiles(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    const totalExisting = existingImages.length;
    if (index < totalExisting) {
      const removed = existingImages[index];
      setRemovedImages(prev => [...prev, removed]);
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      const newIndex = index - totalExisting;
      setImageFiles(prev => prev.filter((_, i) => i !== newIndex));
    }
    setImagePreviews(prev => prev.filter((_, i) => i !== index));

    if (formData.principal_photo === index) {
      setFormData(prev => ({ ...prev, principal_photo: 0 }));
    } else if (formData.principal_photo > index) {
      setFormData(prev => ({ ...prev, principal_photo: prev.principal_photo - 1 }));
    }
  };

  const removeDocument = (index) => {
    if (index < existingDocuments.length) {
      const removed = existingDocuments[index];
      setRemovedDocuments(prev => [...prev, removed]);
      setExistingDocuments(prev => prev.filter((_, i) => i !== index));
    } else {
      const newIndex = index - existingDocuments.length;
      setDocumentFiles(prev => prev.filter((_, i) => i !== newIndex));
    }
  };

  const setMainImage = (index) => {
    setFormData(prev => ({ ...prev, principal_photo: index }));
  };

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
      data.append('group_id', String(formData.group_id) || '');

      imageFiles.forEach(file => data.append('images', file));
      removedImages.forEach(img => data.append('removedImages', img));

      // --- NOVO: anexar documentos e removidos ---
      documentFiles.forEach(file => data.append('documents', file));
      removedDocuments.forEach(doc => data.append('removedDocuments', doc));

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
                <p className="text-foreground font-medium">Clique para fazer upload</p>
                <p className="text-sm text-muted-foreground">PNG, JPG, WEBP até 10MB</p>
              </label>
            </div>

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
                        formData.principal_photo === index ? 'border-primary shadow-lg' : 'border-border'
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

          {/* Upload de Documentos */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <FileText className="w-4 h-4" /> Documentos do Evento
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
              <input
                type="file"
                id="documents"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                multiple
                onChange={handleDocumentUpload}
                className="hidden"
              />
              <label htmlFor="documents" className="cursor-pointer flex flex-col items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <p className="text-foreground font-medium">Clique para enviar documentos</p>
                <p className="text-sm text-muted-foreground">PDF, DOCX, XLSX até 10MB</p>
              </label>
            </div>

            {(existingDocuments.length > 0 || documentFiles.length > 0) && (
              <ul className="mt-4 space-y-2">
                {[...existingDocuments, ...documentFiles.map(f => f.name)].map((doc, index) => (
                  <li key={index} className="flex items-center justify-between bg-muted px-3 py-2 rounded-lg text-sm">
                    <span className="truncate">{typeof doc === 'string' ? doc : doc.name}</span>
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="text-destructive hover:underline text-xs flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> Remover
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Seleção de Grupos */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ListChecks className="w-4 h-4" />
            Selecione o Grupo para este Evento
          </label>

          {loadingGroups ? (
            <p className="text-sm text-muted-foreground">Carregando grupos...</p>
          ) : allGroups.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum grupo disponível.</p>
          ) : (
            <select
              name="group_id"
              value={formData.group_id}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="">— Nenhum grupo selecionado —</option>
              {allGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
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
