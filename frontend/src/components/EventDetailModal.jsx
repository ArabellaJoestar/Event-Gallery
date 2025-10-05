import { X, Calendar, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { eventAPI } from '../services/api';
import ConfirmModal from '../components/ConfirmModal.jsx';
import { useNavigate } from 'react-router-dom';

const EventDetailModal = ({ event, isOpen, onClose, onEventDeleted }) => {
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Reseta o modal de confirmação quando o evento muda
  useEffect(() => {
    setIsConfirmOpen(false);
  }, [event]);


  if (!event) return null;

  const API_BASE = 'http://localhost:3472';

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getImageUrl = (relativePath) =>
    `${API_BASE}${relativePath.replace('.', '')}`;

  const deleteEvent = async () => {
    try {
      await eventAPI.deleteEvent(event.id);
      onEventDeleted(); // chama o pai para atualizar lista e fechar modal
    } catch (err) {
      console.error('Não foi possível deletar evento:', err);
      alert('Não foi possível deletar o evento');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-card rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-border"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-6 flex items-start justify-between z-10">
              <div className="flex-1 pr-4">
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  {event.name.charAt(0).toUpperCase() + event.name.slice(1).toLowerCase()}
                </h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-5 h-5" />
                  <span className="text-base font-medium">{formatDate(event.date_event)}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted transition-colors duration-200 flex-shrink-0"
                aria-label="Fechar modal"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Imagem principal */}
              <div className="relative rounded-xl overflow-hidden bg-muted shadow-lg">
                <motion.img
                  key={selectedImageIndex}
                  src={getImageUrl(event.images[selectedImageIndex])}
                  alt={`${event.name} - Imagem ${selectedImageIndex + 1}`}
                  className="w-full h-96 object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {selectedImageIndex + 1} / {event.images.length}
                  </span>
                </div>
              </div>

              {/* Miniaturas */}
              {event.images.length > 1 && (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {event.images.map((img, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative rounded-lg overflow-hidden aspect-video border-2 transition-all duration-200 ${
                        selectedImageIndex === index
                          ? 'border-primary shadow-lg'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img
                        src={getImageUrl(img)}
                        alt={`Miniatura ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {selectedImageIndex === index && <div className="absolute inset-0 bg-primary/20" />}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Descrição */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">Sobre o Evento</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {event.description === '12null12' ? 'Sem descrição fornecida.' : event.description}
                </p>
              </div>

              {/* Informações adicionais */}
              <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Data de Criação</p>
                  <p className="text-base font-semibold text-foreground">{event.date_creation}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">ID do Evento</p>
                  <p className="text-base font-mono font-semibold text-foreground">{event.id}</p>
                </div>
                <div className="space-y-1 flex items-center">
                  <Button
                    className="text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600"
                     onClick={() => navigate(`/edit/${event.id}`)}
                  >Editar
                  </Button>
                </div>
                <div className="space-y-1 flex items-center">
                  <Button
                    className="text-sm font-medium text-white bg-red-400 hover:bg-red-600"
                    onClick={() => setIsConfirmOpen(true)}
                  >
                    Excluir
                  </Button>
                  <ConfirmModal
                    isOpen={isConfirmOpen}
                    onClose={() => setIsConfirmOpen(false)}
                    onConfirm={deleteEvent}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EventDetailModal;
