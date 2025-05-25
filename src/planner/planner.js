import { useState, useEffect } from 'react';
import '../App.css';
import { Typography, Button, Box, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import SideBoard from '../components/sideBoard';
import CalendarComponent from '../components/calendar';
import AddIcon from '@mui/icons-material/Add';
import { useUser } from "@clerk/clerk-react";
import CreateEventModal from '../components/createEventModal';
import EventModal from '../components/eventModal';
import SimpleSnackbar from '../components/snackbar';

const Planner = () => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const { user } = useUser();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
                    const response = await fetch(`${backendUrl}/api/planner-events/${user.id}`);
                    
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
    }, [user?.id, backendUrl]);

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
        <Box sx={{minHeight: '100vh', backgroundColor: '#FFEEDD', display: 'flex', flexDirection: {xs: 'column', md: 'row'}}}>
            <SimpleSnackbar
                open={snackbar.open}
                onClose={hideSnackbar}
                message={snackbar.message}
                severity={snackbar.severity}
                duration={4000}
            />
            <Box sx={{flex: 1, pl: 2, my: 5}}>
                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: {xs: 2, md: 5}, pl: {xs: 1, md: 2}}}>
                    <Typography variant='h5' fontWeight='bold' sx={{ textTransform: 'capitalize', fontSize: isMobile ? '1.2rem' : '1.5rem'}} >{user.username}'s Planner</Typography>
                    <Button variant='contained' sx={{ backgroundColor: "#9381FF" }} onClick={() => setOpenEventModal(true)} >
                        <AddIcon fontSize={isMobile ? 'small' : 'medium'} />
                        {isMobile ? 'New Event' : 'Create an Event'}
                    </Button>
                </Box>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                        <CircularProgress />
                    </Box>
                ) : (
                    <CalendarComponent setOpenEventModal={setOpenEventModal} setOpenDetailsModal={setOpenDetailsModal} setNewEvent={setNewEvent} events={events} setSelectedEvent={setSelectedEvent} />
                )}
            </Box>
            {!isMobile && (
                <Box sx={{ width: '320px', mt: 10 }}>
                    <SideBoard events={events} />
                </Box>
            )}
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

        </Box>
    )
}

export default Planner
