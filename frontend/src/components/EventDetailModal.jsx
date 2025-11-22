import { X, Calendar, Image as ImageIcon, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button.jsx";
import { eventAPI } from "../services/api";
import ConfirmModal from "../components/ConfirmModal.jsx";
import { useNavigate } from "react-router-dom";
import CopyLinkButton from "../components/ui/CopyLinkButton.jsx";

// Detecta se arquivo é vídeo
const isVideo = (path) =>
  path.endsWith(".mp4") ||
  path.endsWith(".mov") ||
  path.endsWith(".webm") ||
  path.endsWith(".mkv");

const EventDetailModal = ({
  event,
  isOpen,
  onClose,
  onEventDeleted,
  modalError,
}) => {
  const navigate = useNavigate();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isAuth, setIsAuth] = useState(false);

  const [isModalLoading, setIsModalLoading] = useState(true);
  const [isMainLoading, setIsMainLoading] = useState(true);
  const [thumbLoaded, setThumbLoaded] = useState({});

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const API_BASE = "http://localhost:3472";

  const getFileUrl = (p) => (p ? `${API_BASE}${p.replace(".", "")}` : null);

  // registra thumbnail como carregada
  const markThumbLoaded = (i) =>
    setThumbLoaded((prev) => ({ ...prev, [i]: true }));

  useEffect(() => {
    const auth = () => setIsAuth(!!localStorage.getItem("token"));
    auth();
    window.addEventListener("storage", auth);
    return () => window.removeEventListener("storage", auth);
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
    setThumbLoaded({});
    setIsMainLoading(true);
    setIsModalLoading(false);
  }, [event]);

  useEffect(() => {
    if (!event?.images?.length) {
      setIsMainLoading(false);
      return;
    }

    const file = event.images[0];
    const url = getFileUrl(file);

    setIsMainLoading(true);

    if (isVideo(file)) {
      // vídeos usam metadata
      const video = document.createElement("video");
      video.src = url;
      video.onloadeddata = () => setIsMainLoading(false);
      video.onerror = () => setIsMainLoading(false);
    } else {
      const img = new Image();
      img.src = url;
      img.onload = () => setIsMainLoading(false);
      img.onerror = () => setIsMainLoading(false);
    }
  }, [event]);

  const deleteEvent = async () => {
    try {
      await eventAPI.deleteEvent(event.id);
      onEventDeleted();
    } catch (err) {
      alert(`Não foi possível deletar: ${err}`);
    }
  };

  if (!event) return null;

  const images = event.images || [];
  const videos = event.videos || [];

  const media = [...images, ...videos]

  return (
    <AnimatePresence>
      {isOpen && !modalError && (
        <>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {isModalLoading ? (
              <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <motion.div
                className="bg-[#3F5E5A] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* HEADER */}
                <div className="sticky top-0 bg-[#3F5E5A]/95 p-6 pb-0 flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {event.name}
                    </h2>
                    <div className="flex items-center gap-2 text-white">
                      <Calendar className="w-5 h-5" />
                      {new Date(event.date_event).toLocaleDateString("pt-BR")}
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-white/10"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>

                {/* BODY */}
                <div className="p-6 space-y-6">
                  {/* Sem imagens/vídeos */}
                  {media.length === 0 && (
                    <div className="w-full h-[25vh] flex items-center justify-center text-white text-xl">
                      Sem mídia para exibir
                    </div>
                  )}

                  {/* PRINCIPAL */}
                  {media.length > 0 && (
                    <div className="relative rounded-xl overflow-hidden h-96 flex items-center justify-center">
                      {isMainLoading && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                        </div>
                      )}

                      {/* IMAGEM OU VÍDEO */}
                      {isVideo(media[selectedIndex]) ? (
                        <video
                          src={getFileUrl(media[selectedIndex])}
                          controls
                          className="max-w-full max-h-full object-contain"
                          onLoadedData={() => setIsMainLoading(false)}
                        />
                      ) : (
                        <motion.img
                          key={selectedIndex}
                          src={getFileUrl(media[selectedIndex])}
                          className={`max-w-full max-h-full object-contain transition-all duration-300 ${
                            isMainLoading
                              ? "blur-md opacity-50"
                              : "blur-0 opacity-100"
                          }`}
                          onLoad={() => setIsMainLoading(false)}
                        />
                      )}

                      {/* Contador */}
                      <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        {selectedIndex + 1} / {media.length}
                      </div>
                    </div>
                  )}

                  {/* MINIATURAS */}
                  {media.length > 1 && (
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {media.map((file, i) => {
                        const url = getFileUrl(file);
                        const loaded = thumbLoaded[i];

                        return (
                          <button
                            key={i}
                            onClick={() => setSelectedIndex(i)}
                            className={`relative rounded-lg overflow-hidden aspect-video border ${
                              selectedIndex === i
                                ? "border-white"
                                : "border-transparent"
                            }`}
                          >
                            {!loaded && (
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              </div>
                            )}

                            {isVideo(file) ? (
                              <video
                                src={url}
                                className={`w-full h-full object-cover ${
                                  loaded ? "opacity-100" : "opacity-0"
                                }`}
                                onLoadedData={() => markThumbLoaded(i)}
                                onError={() => markThumbLoaded(i)}
                              />
                            ) : (
                              <img
                                src={url}
                                className={`w-full h-full object-cover ${
                                  loaded ? "opacity-100" : "opacity-0"
                                }`}
                                onLoad={() => markThumbLoaded(i)}
                                onError={() => markThumbLoaded(i)}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* DESCRIÇÃO */}
                  {event.description && (
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Sobre o Evento
                      </h3>
                      <p className="text-white opacity-95">{event.description}</p>
                    </div>
                  )}

                  {/* DOCUMENTOS */}
                  {event.documents?.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                        <FileText className="w-5 h-5" /> Documentos
                      </h3>

                      <ul className="space-y-2">
                        {event.documents.map((doc, i) => (
                          <li
                            key={i}
                            className="bg-white/20 p-3 rounded-lg flex justify-between"
                          >
                            <span className="text-white truncate max-w-[70%]">
                              {doc.split("/").pop()}
                            </span>
                            <a
                              href={getFileUrl(doc)}
                              target="_blank"
                              className="text-white underline"
                            >
                              Abrir
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* BOTÕES */}
                  <div className={isAuth ? "grid grid-cols-3 gap-4" : ""}>
                    <CopyLinkButton
                      url={`http://localhost/evento/${event.id}`}
                    />

                    {isAuth && (
                      <Button
                        onClick={() => navigate(`/edit/${event.id}`)}
                        className="bg-yellow-500 hover:bg-yellow-600"
                      >
                        Editar
                      </Button>
                    )}

                    {isAuth && (
                      <Button
                        onClick={() => setIsConfirmOpen(true)}
                        className="bg-red-500 hover:bg-red-700"
                      >
                        Excluir
                      </Button>
                    )}

                    <ConfirmModal
                      isOpen={isConfirmOpen}
                      onClose={() => setIsConfirmOpen(false)}
                      onConfirm={deleteEvent}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </>
      )}

      {/* ERRO */}
      {modalError && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center text-white text-2xl"
          onClick={onClose}
        >
          {modalError}
        </div>
      )}
    </AnimatePresence>
  );
};

export default EventDetailModal;
