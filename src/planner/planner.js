import { useState, useEffect } from 'react';
import '../App.css';
import { Typography, Button, Box, CircularProgress } from '@mui/material';
import SideBoard from '../components/sideBoard';
import CalendarComponent from '../components/calendar';
import AddIcon from '@mui/icons-material/Add';
import { useUser } from "@clerk/clerk-react";
import CreateEventModal from '../components/createEventModal';
import EventModal from '../components/eventModal';
import SimpleSnackbar from '../components/snackbar';

const Planner = () => {
    const { user } = useUser();
    const [openEventModal, setOpenEventModal] = useState(false);
    const [openDetailsModal, setOpenDetailsModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', category: '' });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    const showSnackbar = (message, severity = 'error') => {
    setSnackbar({
        open: true,
        message,
        severity,
    });
    };

    const hideSnackbar = () => {
    setSnackbar(prev => ({
        ...prev,
        open: false,
    }));
    };

    useEffect(() => {
        if (user?.id) {
            const fetchEvents = async () => {
                try {
                    setLoading(true);
                    const response = await fetch(`/api/planner-events/${user.id}`);
                    
                    if (!response.ok) {
                        throw new Error('Failed to fetch events');
                    }
                    
                    const data = await response.json();
                    setEvents(data);
                    showSnackbar("Events loaded successfully!", "success");
                } catch (err) {
                    console.error('Error fetching events:', err);
                    showSnackbar("Failed to load events. Please try again later", "error");
                } finally {
                    setLoading(false);
                }
            };
            
            fetchEvents();
        }
    }, [user?.id]);

    const handleAddEvent = (event) => {
        setEvents([...events, event]);
    };

    const handleEditEvent = (editedEvent) => {
        setEvents(events.map(event => 
          (event.eventId === editedEvent.eventId) ? editedEvent : event
        ));
    };

    const handleEventDeleted = (deletedEventId) => {
        setEvents(currentEvents => currentEvents.filter(event => 
          (event.id || event.eventId) !== deletedEventId
        ));
      };

    return (
        <div style={{minHeight: '100vh'}} className='flex bg-background'>
            <SimpleSnackbar
                open={snackbar.open}
                onClose={hideSnackbar}
                message={snackbar.message}
                severity={snackbar.severity}
                duration={4000}
            />
            <div className='flex-1 p-6'>
                <Box display='flex' alignItems='center' justifyContent='space-between' mb={3} pl={2}>
                    <Typography variant='h5' fontWeight='bold' sx={{ textTransform: 'capitalize'}} >{user.username}'s Planner</Typography>
                    <Button variant='contained' sx={{ backgroundColor: "#9381FF" }} onClick={() => setOpenEventModal(true)} >
                        <AddIcon />
                        Create an Event
                    </Button>
                </Box>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                        <CircularProgress />
                    </Box>
                ) : (
                    <CalendarComponent setOpenEventModal={setOpenEventModal} setOpenDetailsModal={setOpenDetailsModal} setNewEvent={setNewEvent} events={events} setSelectedEvent={setSelectedEvent} />
                )}
            </div>
            <div className="w-80 mt-10">
                <SideBoard events={events} />
            </div>
            <CreateEventModal
             newEvent={newEvent} 
             setNewEvent={setNewEvent} 
             open={openEventModal} 
             onClose={() => setOpenEventModal(false)} 
             handleAddEvent={handleAddEvent}
             isEditing={isEditing}
             selectedEvent={selectedEvent}
             handleEditEvent={handleEditEvent}
            />

            <EventModal
                open={openDetailsModal}
                onClose={() => setOpenDetailsModal(false)}
                setOpenEventModal={setOpenEventModal}
                selectedEvent={selectedEvent}
                setIsEditing={setIsEditing}
                setNewEvent={setNewEvent}
                onEventDeleted={handleEventDeleted}
            />

        </div>
    )
}

export default Planner
