import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import AddEventForm from '../components/AddEventForm';
import { eventAPI } from '../services/api';

const AddEvent = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      const response = await eventAPI.createEvent(formData);
      if (response.id) {
        navigate('/');
      } else {
        console.error('Erro ao criar evento:', response);
      }
    } catch (error) {
      console.error('Erro ao criar evento:', error);
    }
  };


  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40 backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Plus className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Adicionar Novo Evento
                </h1>
                <p className="text-sm text-muted-foreground">
                  Preencha as informações do evento
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AddEventForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </motion.div>
      </main>
    </div>
  );
};

export default AddEvent;
