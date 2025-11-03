import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import EventCard from './EventCard';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import { groupAPI } from '../services/api';

export default function GroupCard({ group, onCardClick, onGroupDeleted, isAuth}) {
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const deleteGroup = async () => {
        try {
            await groupAPI.deleteGroup(group.id);
            onGroupDeleted(group.id);
        } catch (err) {
            console.error('Não foi possível deletar Grupo:', err);
            alert('Não foi possível deletar o Grupo');
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
    };

    return (
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <div className="p-4 rounded-lg bg-green-800 text-white">
                <div className={`flex justify-between items-center mb-5 ${ group.events.length > 1 ? 'cursor-pointer' : ''}`}
                onClick={() => group.events.length > 1 ? setExpanded(!expanded) : console.log('none')}>
                    <h2 className="text-xl font-bold">{group.name}</h2>
                    {group.events.length > 1 && (
                        <div className="flex items-center gap-1 text-gray-500">
                            <span>{expanded && group.events.length > 1  ? 'Ocultar' : 'Mostrar mais'}</span>
                            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                    )}
                </div>

                {expanded && group.events.length > 0 && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className={`grid grid-cols-${group.events.length >= 3 ? '3' : '2'} gap-4 mt-2 mb-5`}
                    >
                        {group.events.map(event => (
                            <EventCard key={event.id} event={event} onClick={onCardClick} />
                        ))}
                    </motion.div>
                )}

                {group.events.length === 0 && (
                    <p className="text-sm text-muted-foreground">Sem eventos neste grupo.</p>
                )}

                {!expanded && group.events.length >= 1 && (
                    <EventCard key={group.events[0].id} event={group.events[0]} onClick={onCardClick}/>
                )

                }
                



                {isAuth && <div className="flex items-center gap-5 mt-5">
                    <Button
                        className="text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 h-10 p-3"
                        onClick={() => navigate(`/edit-group/${group.id}`)}
                    >
                        Editar
                    </Button>

                    <Button
                        className="text-sm font-medium text-white bg-red-400 hover:bg-red-600 h-10 p-3"
                        onClick={() => setIsConfirmOpen(true)}
                    >
                        Excluir
                    </Button>
                    <ConfirmModal
                        isOpen={isConfirmOpen}
                        onClose={() => setIsConfirmOpen(false)}
                        onConfirm={deleteGroup}
                    />
                </div>}
            </div>
        </motion.div>
    );
}
