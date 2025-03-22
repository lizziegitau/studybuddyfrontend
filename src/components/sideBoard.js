import '../App.css';
import { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material'
import {events} from '../eventData'
import { format } from "date-fns";

function SideBoard() {
    const [selectedDate, setSelectedDate] = useState(dayjs());

    const getEventsForDate = (date) => {
        return events.filter(event => dayjs(event.start).isSame(date, 'day'));
    };

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

            <div className="rounded-2xl shadow-sm bg-white m-5 p-5">
                    <Typography variant="h6" className="text-black font-semibold mb-2" >
                        {selectedDate.format("MMM D, YYYY")}
                    </Typography>
                    {getEventsForDate(selectedDate).length > 0 ? (
                        <Box >
                            <List>
                                {getEventsForDate(selectedDate).map((event, index) => (
                                        <ListItem key={index}>
                                            <ListItemText 
                                                primary={event.title} 
                                                secondary={format(new Date(event.start), "MMMM dd, yyyy HH:mm")}
                                            />
                                        </ListItem>
                                ))}
                            </List>
                        </Box>
                    ) : (
                        <Box>
                            <Typography className="text-md">
                                No scheduled events for today
                            </Typography>
                        </Box>
                    )}
                </div>
        </Box>
    );
}

export default SideBoard;

