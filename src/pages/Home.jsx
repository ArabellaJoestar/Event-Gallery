import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Loader2, Plus, LogOut, LogIn } from 'lucide-react';
import EventCard from '../components/EventCard';
import EventDetailModal from '../components/EventDetailModal';
import { Button } from '@/components/ui/button.jsx';
import { groupAPI, eventAPI } from '../services/api.js';
import GroupCard from '@/components/GroupCard'
import * as Switch from '@radix-ui/react-switch';

const Home = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [groups, setGroups] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventsLoaded, setEventsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [viewMode, setViewMode] = useState("events");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const loadGroups = async () => {
    setLoading(true);
    try {
      const data = await groupAPI.getAllGroups();
      const groupsWithImages = data.map(group => ({
        ...group,
        events: group.events?.map(event => ({
          ...event,
          imageUrl: `${event.images[event.principal_photo]?.replace('.', '')}`
        })) || []
      }));
      setGroups(groupsWithImages);
    } catch (error) {
      console.error('Erro ao carregar grupos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await eventAPI.getAllEvents();
      const eventsWithImages = data.map(event => ({
        ...event,
        imageUrl: `${event.images[event.principal_photo]?.replace('.', '')}`
      }));
      setEvents(eventsWithImages);
      setEventsLoaded(true);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (id && eventsLoaded) {
    // Procura em ambos os arrays
    const all = [
      ...events,
      ...groups.flatMap(g => g.events || [])
    ];

    const found = all.find(e => String(e.id) === String(id));

    if (found) {
      setSelectedEvent(found);
      setIsModalOpen(true);
    }
  }
}, [id, eventsLoaded, groups, events]);

  useEffect(() => {
    const handleStorageChange = () => setIsAuth(!!localStorage.getItem('token'));
    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    loadGroups();
  }, []);

  useEffect(() => {
    if (viewMode === "events" && !eventsLoaded) {
      loadEvents();
    }
  }, [viewMode]);

  const handleCardClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate('/');
    setTimeout(() => setSelectedEvent(null), 300);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const filteredResults = () => {
  const term = searchTerm.toLowerCase();

  if (viewMode === "groups") {
    let finalValue
    searchTerm !== '' ?
      finalValue = groups.filter(
        group =>{
          return group.name?.toLowerCase().includes(searchTerm.toLowerCase());
        }
      ) :
      finalValue = groups;
      
    return finalValue;
   
  } else {
    return events.filter(event =>
      event.name.toLowerCase().includes(term) &&
      (!filterDate || event.date_event === filterDate)
    );
  }
};



  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-border sticky top-0 z-40 backdrop-blur-sm bg-green-800 w-full">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 place-items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-700 rounded-lg">
                <Calendar className="w-10 h-10 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Galeria de eventos</h1>
                <p className="text-sm text-white">Fique por dentro de todos os eventos!</p>
              </div>
            </div>
            {!isAuth && (
              <Button onClick={() => navigate('/login')} className="flex items-center gap-2 bg-blue-800 w-50 h-full">
                <LogIn /> Login
              </Button>
            )}
            {
              isAuth && (
                <div className='grid grid-cols-2'>
                  <div className="flex flex-col items-center justify-center">
                    <Button onClick={handleLogout} className="flex items-center gap-2 bg-red-600">
                      <LogOut className="w-5 h-5" /> Logout
                    </Button>
                  </div>
                  <div className="flex gap-5 items-center">
                    <div className='flex flex-col gap-2'>
                      <Button onClick={() => navigate('/add-event')} className="flex items-center gap-2">
                        <Plus className="w-5 h-5" /> Criar Evento
                      </Button>
                      <Button onClick={() => navigate('/add-group')} className="flex items-center gap-2">
                        <Plus className="w-5 h-5" /> Criar Grupo de Eventos
                      </Button>
                    </div>
                  </div>
                </div>
              )
            }
          </div>
        </div>


      </header>



      <main className="grow w-full px-20 py-4 bg-green-700">

        <div className="flex items-center justify-center pb-4 gap-3 text-white font-bold">
          <span>Eventos</span>
          <Switch.Root
            checked={viewMode === "groups"}
            onCheckedChange={(v) => setViewMode(v ? "groups" : "events")}
            className="w-[42px] h-[25px] bg-green-800 rounded-full relative transition-colors"
          >
            <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full shadow absolute top-1 left-1 transition-transform data-[state=checked]:translate-x-[17px]" />
          </Switch.Root>
          <span>Grupos</span>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-green-800 p-4 rounded-lg shadow mb-6 placeholder-white text-white">
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 rounded-md outline-none w-full md:w-1/3 text-white placeholder-white"
          />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-3 py-2 rounded-md outline-none w-full md:w-1/4"
          />
          <Button
            onClick={() => { setSearchTerm(""); setFilterDate(""); }}
            className="bg-red-600 text-white"
          >
            Limpar Filtros
          </Button>
        </div>

        <div className='mt-2'>
          {loading ? (
            //Component de carregamento da página
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-muted-foreground text-lg">Carregando...</p>
            </div>
          ) : viewMode === "groups" ? (
            filteredResults().length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Calendar className="w-16 h-16 text-secondary" />
                <p className="text-secondary text-lg">Nenhum grupo encontrado</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {filteredResults().map(group => (
                  <GroupCard
                    key={group.id}
                    group={group}
                    onCardClick={handleCardClick}
                    onGroupDeleted={(deletedGroupId) => {
                      setGroups(prev => prev.filter(g => g.id !== deletedGroupId));

                    }}
                    isAuth={isAuth}
                  />
                ))}
              </div>
            )
          ) : filteredResults().length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
              <Calendar className="w-16 h-16 text-secondary" />
              <p className="text-secondary text-lg">Nenhum evento encontrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResults().map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={handleCardClick}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <EventDetailModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onEventDeleted={() => {
          setGroups(prev => prev.map(g => ({
            ...g,
            events: g.events.filter(e => e.id !== selectedEvent.id)
          })));
          setEvents(prev => prev.filter(e => e.id !== selectedEvent.id));
          handleCloseModal();
        }}
      />
    </div>
  );
};

export default Home;
