import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Type, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { groupAPI, eventAPI } from '../services/api.js';


const AddGroupForm = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    events: []
  });

  const [allEvents, setAllEvents] = useState([]); // lista vinda do backend
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // === Buscar eventos disponíveis ===
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await eventAPI.getAllEvents() // busca todos os eventos
        // filtra apenas eventos ativos e sem grupo (opcional)
        const filtered = res.filter(e => !e.group_id && !e.date_deletion);
        setAllEvents(filtered);
      } catch (err) {
        console.error('Erro ao buscar eventos:', err);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  // === Alterar campos de texto ===
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // === Selecionar/Deselecionar eventos ===
  const toggleEventSelection = (eventId) => {
    setFormData((prev) => {
      const alreadySelected = prev.events.includes(eventId);
      const newEvents = alreadySelected
        ? prev.events.filter((id) => id !== eventId)
        : [...prev.events, eventId];
      return { ...prev, events: newEvents };
    });
  };

  // === Envio do formulário ===
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      alert('O nome do grupo é obrigatório.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description || '',
        events: formData.events
      };

      // 🔹 Usando diretamente a função createGroup do api.js
      await groupAPI.createGroup(payload);

      // Limpa o formulário
      setFormData({ name: '', description: '', events: [] });

      alert('Grupo criado com sucesso!');
      onCancel(); // fecha o form ou modal após criação
    } catch (error) {
      console.error('Erro ao criar grupo:', error);
      alert('Erro ao criar grupo. Tente novamente.');
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
        {/* Nome do Grupo */}
        <div className="space-y-2">
          <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Type className="w-4 h-4" />
            Nome do Grupo *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Ex: Feiras e Exposições"
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
            placeholder="Descreva o grupo de eventos..."
            rows="4"
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
          />
        </div>

        {/* Seleção de Eventos */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ListChecks className="w-4 h-4" />
            Selecione os Eventos para este Grupo
          </label>

          {loadingEvents ? (
            <p className="text-sm text-muted-foreground">Carregando eventos...</p>
          ) : allEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum evento disponível para agrupar.</p>
          ) : (
            <div className="max-h-64 overflow-y-auto border border-border rounded-lg p-3 space-y-2">
              {allEvents.map((ev) => (
                <label
                  key={ev.id}
                  className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 px-2 py-1 rounded-md transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.events.includes(ev.id)}
                    onChange={() => toggleEventSelection(ev.id)}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm text-foreground">
                    {ev.name} — <span className="text-muted-foreground">{ev.date_event}</span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Botões */}
        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? 'Criando...' : 'Criar Grupo'}
          </Button>
          <Button type="button" onClick={onCancel} variant="outline" disabled={isSubmitting}>
            Cancelar
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddGroupForm;
