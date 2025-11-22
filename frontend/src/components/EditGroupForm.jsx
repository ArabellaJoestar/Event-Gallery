import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Type, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { groupAPI, eventAPI } from '../services/api.js';

const EditGroupForm = ({ groupId, onCancel }) => {
  // Setando states padrão do formulário
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    events: []
  });
  const [allEvents, setAllEvents] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // State crítico, recebimento da lista de eventos para inclusão no grupo(Não mexer)
  const [loadingEvents, setLoadingEvents] = useState(true);


  // Função auxiliar para formatação de datas em formato DD-MM-YY
  const formatDateNum = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    })
  }
  

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventAPI.getAllEvents();
        const filtered = data.filter(e => !e.date_deletion);
        setAllEvents(filtered);
      } catch (err) {
        console.error('Erro ao buscar eventos:', err);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const group = await groupAPI.getGroupById(groupId);

        let parsedEvents = [];
        if (typeof group.events === 'string') {
          try {
            parsedEvents = JSON.parse(group.events);
          } catch {
            parsedEvents = [];
          }
        } else if (Array.isArray(group.events)) {
          parsedEvents = group.events.map(e => e.id ?? e);
        }

        setFormData({
          name: group.name || '',
          description: group.description || '',
          events: parsedEvents
        });
      } catch (err) {
        console.error('Erro ao carregar grupo:', err);
      }
    };
    fetchGroup();
  }, [groupId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleEventSelection = (eventId) => {
    setFormData(prev => {
      const alreadySelected = prev.events.includes(eventId);
      const newEvents = alreadySelected
        ? prev.events.filter(id => id !== eventId)
        : [...prev.events, eventId];
      return { ...prev, events: newEvents };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert('O nome do grupo é obrigatório.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        events: formData.events
      };

      await groupAPI.updateGroup(groupId, payload);
      alert('Grupo atualizado com sucesso!');
      onCancel();
    } catch (error) {
      console.error('Erro ao atualizar grupo:', error);
      alert('Erro ao atualizar grupo. Tente novamente.');
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
              {allEvents.map(ev => (
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
                    {ev.name} — <span className="text-muted-foreground">{formatDateNum(ev.date_event)}</span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Botões */}
        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
          </Button>
          <Button type="button" onClick={onCancel} variant="outline" disabled={isSubmitting}>
            Cancelar
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default EditGroupForm;
