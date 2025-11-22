import { useState } from 'react';
import { Calendar } from 'lucide-react';

const EventCard = ({ event, onClick}) => {
  const [ratio, setRatio] = useState("square");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Obtém imagem principal
  let mainImage;
  const API_BASE = 'http://localhost:3472';

  if (event.images[0]) {
    const getImageUrl = (relativePath) =>
      `${API_BASE}${relativePath.replace('./', '/')}`;
    mainImage = getImageUrl(event.images[event.principal_photo] || event.images[0]);
  }

  // Detecta proporção da imagem ao carregar
  const handleLoad = (e) => {
    const { naturalWidth: w, naturalHeight: h } = e.target;
    if (w > h) setRatio("horizontal");
    else if (h > w)  setRatio("vertical");
    else setRatio("square");
    
  };

  return (
    <div
      onClick={() => onClick(event)}
      className={`
                group cursor-pointer rounded-xl overflow-hidden shadow-xs hover:shadow-2xl 
                transition-all duration-300 bg-[#3F5E5A] flex flex-col
              
                ${ratio === "vertical" ? "row-span-2" : ""}
                ${ratio === "horizontal" ? "col-span-2 row-span-2 h-full" : ""}
              `}
    >
      <div className="relative h-full overflow-hidden bg-muted">
        {mainImage ? (
          <img
            src={mainImage}
            alt={event.name}
            onLoad={handleLoad}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full text-center flex items-center justify-center text-gray-700">
            <h1>Sem imagem para exibir.</h1>
          </div>
        )}

        <div className="absolute inset-0 from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-5 flex flex-col justify-center mb-2">
        <h3 className="text-3xl font-bold text-white mb-3 line-clamp-2">
          {event.name}
        </h3>

        <div className="flex items-center gap-2 text-gray-200">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">
            {formatDate(event.date_event)}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2 text-white text-sm font-semibold">
          <span>Ver detalhes</span>
          <span>→</span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
