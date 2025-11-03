import { Calendar } from 'lucide-react';

const EventCard = ({ event, onClick }) => {
  // Formata a data para exibição
  const formatDate = (dateString) => {

    const date = new Date(dateString);

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Obtém a imagem principal do evento

  let mainImage

  const API_BASE = 'http://localhost:3472';
  if (event.images[0]) {
    const getImageUrl = (relativePath) =>
      `${API_BASE}${relativePath.replace('./', '/')}`;
    mainImage = getImageUrl(event.images[event.principal_photo] || event.images[0]);
  }


  return (
    <div
      onClick={() => onClick(event)}
      className="group cursor-pointer bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 w-[100%]"
    >
      {/* Imagem do Evento */}
      <div className="relative h-32 overflow-hidden bg-muted">
        {mainImage ?
          <img
            src={mainImage}
            alt={event.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          /> :
          <div className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 text-center flex items-center justify-center text-gray-700">
            <h1>Sem imagem para exibir.</h1>
          </div>
        }
        {/* Overlay com gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Conteúdo do Card */}
      <div className="p-5 flex flex-col">
        {/* Título do Evento */}
        <h3 className="text-3xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {event.name.charAt(0).toUpperCase() + event.name.slice(1).toLowerCase()}
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
          <span>→</span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;