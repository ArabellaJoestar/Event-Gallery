import { useNavigate, useParams } from 'react-router-dom'; // useParams adicionado
import { ArrowLeft, Pencil } from 'lucide-react';
import { motion } from 'framer-motion';
import EditGroupForm from '../components/EditGroupForm';
import { groupAPI } from '../services/api'; // ajustar para groupAPI

const EditGroup = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // pega o id do grupo na rota

  const handleSubmit = async (formData) => {
    try {
      await groupAPI.updateGroup(id, formData);
      alert('Grupo atualizado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Erro ao atualizar grupo:', error);
      alert('Erro ao atualizar grupo. Tente novamente.');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40 backdrop-blur-sm">
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
              <div className="p-2 bg-yellow-500 rounded-lg">
                <Pencil className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Edição dados do Grupo
                </h1>
                <p className="text-sm text-muted-foreground">
                  Preencha as informações do Grupo
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
          <EditGroupForm groupId={id} onSubmit={handleSubmit} onCancel={handleCancel} />
        </motion.div>
      </main>
    </div>
  );
};

export default EditGroup;
