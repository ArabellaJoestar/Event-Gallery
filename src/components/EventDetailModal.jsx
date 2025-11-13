import { X, Calendar, Image as ImageIcon, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { eventAPI } from '../services/api';
import ConfirmModal from '../components/ConfirmModal.jsx';
import { useNavigate } from 'react-router-dom';
import CopyLinkButton from '../components/ui/CopyLinkButton.jsx'

const EventDetailModal = ({ event, isOpen, onClose, onEventDeleted }) => {

  // Instanciando useNavigate para utilizações posteriores
  const navigate = useNavigate();

  // Setando states padrão da modal
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // useEffect para verificação se modal está aberta
  useEffect(() => {
    setIsConfirmOpen(false);
  }, [event]);

  // state para verificação se usuário está autenticado, utilizado para visualização dos campos de edição ou exclusão do evento.
  const [isAuth, setIsAuth] = useState(false);

  // useEffect para verificação do token de login
  useEffect(() => {
    const handleStorageChange = () => setIsAuth(!!localStorage.getItem('token'));
    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Verifica se o evento passado para a modal existe, caso não exista não retorna nada
  if (!event) return null;

  const API_BASE = 'http://localhost:3472';

  const formatDateString = (dateString) => {

    const date = new Date(dateString);

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateNum = (dateString) => {

    const date = new Date(dateString)

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    })
  }

  const getFileUrl = (relativePath) => `${API_BASE}${relativePath.replace('.', '')}`;
  const getImageUrl = getFileUrl;

  const deleteEvent = async () => {
    try {
      await eventAPI.deleteEvent(event.id);
      onEventDeleted();
    } catch (err) {
      console.error('Não foi possível deletar evento:', err);
      alert('Não foi possível deletar o evento');
    }
  };

  return (
    <AnimatePresence>
      {console.log(event)}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div
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
                  <span className="text-base font-medium">{formatDateString(event.date_event)}</span>
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
              {event.images[0] ?
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
                :
                <div className="w-full h-[20vh] object-cover transition-transform duration-500 group-hover:scale-110 text-center flex items-center justify-center">
                  <h1>Sem imagens para exibir.</h1>
                </div>
              }

              {/* Miniaturas */}
              {event.images.length > 1 && (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {event.images.map((img, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative rounded-lg overflow-hidden aspect-video border-2 transition-all duration-200 ${selectedImageIndex === index
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
              {event.description !== '12null12' && event.description !== '' &&
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-foreground">Sobre o Evento</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                </div>
              }

              {/* Lista de Documentos */}
              {event.documents && event.documents.length > 0 && (
                <div className="space-y-3 border-t border-border pt-4">
                  <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Documentos do Evento
                  </h3>
                  <ul className="space-y-2">
                    {event.documents.map((doc, index) => (
                      <li key={index} className="flex items-center justify-between bg-muted/40 rounded-lg px-4 py-2 hover:bg-muted transition-colors">
                        <div className="flex items-center gap-2 text-foreground">
                          <FileText className="w-4 h-4 text-primary" />
                          <span className="truncate max-w-xs md:max-w-sm">{doc.split('/').pop()}</span>
                        </div>
                        <a
                          href={getFileUrl(doc)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          Abrir
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Button para copiar link direto para o modal */}
              <div className="space-y-1 flex items-center">
                <CopyLinkButton url={`http://localhost:5173/event-gallery/evento/${event.id}`} />
              </div>

              {/* Informações adicionais */}
              {isAuth && (
                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Data de Criação</p>
                    <p className="text-base font-semibold text-foreground">{formatDateNum(event.date_creation)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">ID do Evento</p>
                    <p className="text-base font-mono font-semibold text-foreground">{event.id}</p>
                  </div>

                  <div className="space-y-1 flex items-center">
                    <Button
                      className="text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 h-10 p-3"
                      onClick={() => navigate(`/edit/${event.id}`)}
                    >
                      Editar
                    </Button>
                  </div>
                  <div className="space-y-1 flex items-center">
                    <Button
                      className="text-sm font-medium text-white bg-red-400 hover:bg-red-600 h-10 p-3"
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
              )}
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EventDetailModal;
