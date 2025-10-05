import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const EventCard = ({ event, onClick }) => {
  // Formata a data para exibição
  const formatDate = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  // Mês começa do 0 em JavaScript
  const date = new Date(year, month - 1, day);
  
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

  // Obtém a imagem principal do evento

  const API_BASE = 'http://localhost:3472';
  const getImageUrl = (relativePath) =>
    `${API_BASE}${relativePath.replace('.', '')}`;
    const mainImage = getImageUrl(event.images[event.principal_photo] || event.images[0]);

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={() => onClick(event)}
      className="group cursor-pointer bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-border "
    >
      {/* Imagem do Evento */}
      <div className="relative h-32 overflow-hidden bg-muted">
        <motion.img
          src={mainImage}
          alt={event.nome}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Overlay com gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Conteúdo do Card */}
      <div className="p-5 flex flex-col">
        {/* Título do Evento */}
        <h3 className="text-5xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {event.name.charAt(0).toUpperCase()+event.name.slice(1).toLowerCase()}
        </h3>

        {/* Data do Evento */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">
            {formatDate(event.date_event)}
          </span>
        </div>

        {/* Indicador de mais detalhes */}
        <div className="mt-4 flex items-center gap-2 text-black text-sm font-semibold group-hover:opacity-100 transition-opacity duration-300">
          <span>Ver detalhes</span>
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            →
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
