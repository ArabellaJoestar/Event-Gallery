import { useEffect, useState } from 'react';
import { Upload, X, Plus, Calendar, Type, Image as ImageIcon, FileText, ListChecks } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { groupAPI } from '@/services/api.js';

const AddEventForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    date_event: '',
    description: '',
    principal_photo: 0,
    group_id: ''
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateError, setDateError] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [allGroups, setAllGroups] = useState([]);

  // 🔹 Busca todos os grupos válidos (sem date_deletion)
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

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'name') {
      const cleanedValue = value.replace(/[^a-zA-Z0-9À-ÿ\s]/g
, '');
      setFormData((prev) => ({
        ...prev,
        [name]: cleanedValue
      }));
      return;
    }
    if (
      name === 'date_event' &&
      (formatDate(value).getFullYear() < new Date().getFullYear() - 100 ||
        formatDate(value) > new Date())
    ) {
      setDateError(true);
    } else {
      setDateError(false);
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
        setImageFiles((prev) => [...prev, file]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDocumentsUpload = (e) => {
    const files = Array.from(e.target.files);
    setDocumentFiles((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));

    if (formData.principal_photo === index) {
      setFormData((prev) => ({ ...prev, principal_photo: 0 }));
    } else if (formData.principal_photo > index) {
      setFormData((prev) => ({ ...prev, principal_photo: prev.principal_photo - 1 }));
    }
  };

  const removeDocument = (index) => {
    setDocumentFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const setMainImage = (index) => {
    setFormData((prev) => ({ ...prev, principal_photo: index }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.date_event || imageFiles.length === 0) {
      alert('Por favor, preencha todos os campos obrigatórios e adicione pelo menos uma imagem.');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description || '');
      data.append('date_event', formData.date_event);
      data.append('principal_photo', String(formData.principal_photo ?? 0));
      data.append('group_id', String(formData.group_id || ''));

      imageFiles.forEach((file) => data.append('images', file));
      documentFiles.forEach((file) => data.append('documents', file));

      await onSubmit(data);

      // Resetar formulário
      setFormData({
        name: '',
        date_event: '',
        description: '',
        principal_photo: 0,
        group_id: ''
      });
      setImageFiles([]);
      setImagePreviews([]);
      setDocumentFiles([]);
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      alert('Erro ao criar evento. Tente novamente.');
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
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nome do Evento */}
        <div className="space-y-2">
          <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Type className="w-4 h-4" />
            Nome do Evento *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Ex: Conferência Tech Summit 2024"
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            required
          />
        </div>

        {/* Data do Evento */}
        <div className="space-y-2">
          <label htmlFor="date_event" className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Calendar className="w-4 h-4" />
            Data do Evento *
          </label>
          {dateError && <p className="text-xs text-red-600">A data fornecida é inválida</p>}
          <input
            type="date"
            id="date_event"
            name="date_event"
            value={formData.date_event}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            required
          />
        </div>

        {/* Descrição */}
        <div className="space-y-2">
          <label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Type className="w-4 h-4" />
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Descreva o evento..."
            rows="4"
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
          />
        </div>

        {/* Upload de Imagens */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ImageIcon className="w-4 h-4" />
            Imagens do Evento *
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
                    className={`w-full h-32 object-cover rounded-lg border-2 transition-all ${formData.principal_photo === index
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
                        className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                        title="Definir como principal"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-2 bg-destructive text-white rounded-full hover:bg-destructive/90 transition-colors"
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
            <FileText className="w-4 h-4" />
            Documentos do Evento
          </label>

          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
            <input
              type="file"
              id="documents"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
              multiple
              onChange={handleDocumentsUpload}
              className="hidden"
            />
            <label htmlFor="documents" className="cursor-pointer flex flex-col items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-foreground font-medium">Clique para enviar documentos</p>
                <p className="text-sm text-muted-foreground">PDF, DOCX, XLSX até 25MB</p>
              </div>
            </label>
          </div>

          {/* Lista de Documentos */}
          {documentFiles.length > 0 && (
            <ul className="mt-3 space-y-2">
              {documentFiles.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between text-sm border border-border rounded-lg px-3 py-2 bg-muted/30"
                >
                  <span className="truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeDocument(index)}
                    className="text-destructive hover:text-destructive/80"
                    title="Remover documento"
                  >
                    <X className="w-4 h-4" />
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

        {/* Botões de Ação */}
        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={isSubmitting || dateError} className="flex-1">
            {isSubmitting ? 'Criando...' : 'Criar Evento'}
          </Button>
          <Button type="button" onClick={onCancel} variant="outline" disabled={isSubmitting}>
            Cancelar
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddEventForm;
