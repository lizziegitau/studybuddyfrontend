import { useState } from 'react';
import '../App.css';
import { Typography, Button, Box } from '@mui/material';
import SideBoard from '../components/sideBoard';
import CalendarComponent from '../components/calendar';
import AddIcon from '@mui/icons-material/Add';
import { useUser } from "@clerk/clerk-react";
import { events as initialEvents } from "../eventData";
import CreateEventModal from '../components/createEventModal';

function Planner () {

    const { user } = useUser();
    const [openEventModal, setOpenEventModal] = useState(false);
      const [events, setEvents] = useState(initialEvents);
    const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', category: '' });

    const handleAddEvent = (event) => {
        setEvents([...events, { ...event, start: new Date(event.start), end: new Date(event.end), color: "#B8B8FF" }]);
      };

    return (
        <div style={{minHeight: '100vh'}} className='flex bg-background'>
            <div className='flex-1 p-6'>
                <Box display='flex' alignItems='center' justifyContent='space-between' mb={3} pl={2}>
                    <Typography variant='h5' fontWeight='bold' sx={{ textTransform: 'capitalize'}} >{user.username}'s Planner</Typography>
                    <Button variant='contained' sx={{ backgroundColor: "#9381FF" }} onClick={() => setOpenEventModal(true)} >
                        <AddIcon />
                        Create an Event
                    </Button>
                </Box>
                <CalendarComponent setOpenEventModal={setOpenEventModal} setNewEvent={setNewEvent} events={events} />
            </div>
            <div className="w-80 mt-10">
                <SideBoard />
            </div>
            <CreateEventModal
             newEvent={newEvent} 
             setNewEvent={setNewEvent} 
             open={openEventModal} 
             onClose={() => setOpenEventModal(false)} 
             handleAddEvent={handleAddEvent} 
            />
        </div>
    )
}

export default Planner

