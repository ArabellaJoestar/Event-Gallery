import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Loader2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import EventCard from '../components/EventCard';
import EventDetailModal from '../components/EventDetailModal';
import { eventAPI } from '../services/api';
import { Button } from '@/components/ui/button.jsx';

// ... imports mantidos

const Home = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_BASE = 'http://localhost:3472';

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/`);
      const data = await response.json();
      const updatedData = data.map(event => ({
        ...event,
        imageUrl: `${API_BASE}${event.images[event.principal_photo].replace('.', '')}`
      }));
      setEvents(updatedData);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedEvent(null), 300);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className=" border-border sticky top-0 z-40 backdrop-blur-sm bg-green-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <Calendar className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Eventos Esperança Recife
                </h1>
                <p className="text-sm text-white">
                  Fique por dentro de todos os eventos!
                </p>
              </div>
            </div>

            {events.length === 0 ?
            ""
            
            :
            <Button onClick={() => navigate('/add')} className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Adicionar Evento</span>
            </Button>
            }
            
          </div>
        </div>
      </header>

      <main className="flex-grow w-full px-20 py-8 bg-green-700">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-muted-foreground text-lg">Carregando eventos...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Calendar className="w-16 h-16 text-secondary" />
            <p className="text-secondary text-lg">Nenhum evento encontrado</p>
            <Button onClick={() => navigate('/add')} className="mt-4">
              <Plus className="w-5 h-5 mr-2" />
              Criar Primeiro Evento
            </Button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {events.map((event) => (
              <motion.div key={event.id} variants={itemVariants}>
                <EventCard event={event} onClick={handleCardClick} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      <EventDetailModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

    </div>
  );
};

export default Home;
