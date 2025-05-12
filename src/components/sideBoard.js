import '../App.css';
import { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';
import { Box, Typography, List, ListItem, Chip } from '@mui/material';

function SideBoard({ events }) {
    const [selectedDate, setSelectedDate] = useState(dayjs());

    const getEventsForDate = (date) => {
        return events.filter(event => {
            const eventDate = dayjs(event.eventDate);
            return eventDate.isSame(date, 'day');
        });
    };

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    const getEventTypeColor = (type) => {
        switch(type) {
            case 'Class':
                return { bgcolor: '#bbdefb', color: '#0d47a1' };
            case 'Assignment':
                return { bgcolor: '#fff9c4', color: '#f57f17' };
            case 'Exam':
                return { bgcolor: '#ffcdd2', color: '#b71c1c' };
            default:
                return { bgcolor: '#e0e0e0', color: '#424242' };
        }
    };

    const eventsForSelectedDate = getEventsForDate(selectedDate);

    return (
        <Box className="p-4 w-full">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box className="px-4">
                    <DateCalendar 
                        value={selectedDate} 
                        onChange={(newDate) => setSelectedDate(newDate)}
                        className="max-w-[270px]"
                    />
                </Box>
            </LocalizationProvider>

            <Box className="rounded-2xl shadow-sm bg-white m-5 p-5">
                <Typography variant="h6" className="text-black font-semibold mb-2">
                    {selectedDate.format("MMM D, YYYY")}
                </Typography>
                
                {eventsForSelectedDate.length > 0 ? (
                    <List>
                        {eventsForSelectedDate.map((event) => {
                            const chipStyle = getEventTypeColor(event.eventType);
                            
                            return (
                                <ListItem key={event.eventId} sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'flex-start',
                                    borderBottom: '1px solid #f0f0f0',
                                    paddingBottom: '8px',
                                    paddingTop: '8px'
                                }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 0.5 }}>
                                        <Typography sx={{ fontWeight: 500 }}>
                                            {event.eventTitle}
                                        </Typography>
                                        <Chip 
                                            label={event.eventType}
                                            size="small"
                                            sx={{ 
                                                bgcolor: chipStyle.bgcolor, 
                                                color: chipStyle.color,
                                                fontWeight: 500,
                                                fontSize: '0.75rem'
                                            }} 
                                        />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                    </Typography>
                                </ListItem>
                            );
                        })}
                    </List>
                ) : (
                    <Typography>
                        No scheduled events for today
                    </Typography>
                )}
            </Box>
        </Box>
    );
}

export default SideBoard;
