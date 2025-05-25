import '../App.css';
import { useState } from 'react';
import { Box, TextField, MenuItem, Typography, Modal, Button, FormControl, InputLabel, Select } from "@mui/material";
import { useUser } from "@clerk/clerk-react";
import SimpleSnackbar from './snackbar';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px',
  };

function CreateEventModal ({newEvent, setNewEvent, open, onClose, handleAddEvent, isEditing, selectedEvent, handleEditEvent}) {

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const handleChange = (e) => setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
    const { user } = useUser();
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

    const handleSubmit = async () => {
        if (!newEvent.title || !newEvent.start || !newEvent.end || !newEvent.category) {
          showSnackbar("Please fill out all fields.", "error");
          return;
        }

        // Parse the input date-time values as local dates
        const startDate = new Date(newEvent.start);
        const endDate = new Date(newEvent.end);

        // Format the date as YYYY-MM-DD
        const formatDate = (date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        // Format time as HH:MM:SS
        const formatTime = (date) => {
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          const seconds = String(date.getSeconds()).padStart(2, '0');
          return `${hours}:${minutes}:${seconds}`;
        };

        // Prepare event data with properly formatted date and times
        const eventToAdd = {
          userId: user.id,
          title: newEvent.title,
          eventDate: formatDate(startDate),
          startTime: formatTime(startDate),
          endTime: formatTime(endDate),
          category: newEvent.category,
        };
      
        try {
          const res = await fetch(`${backendUrl}/api/planner-events`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(eventToAdd),
          });
      
          if (res.ok) {
            const savedEvent = await res.json();
            const eventDateParts = savedEvent.eventDate.split('-');
            const startTimeParts = savedEvent.startTime.split(':');
            const endTimeParts = savedEvent.endTime.split(':');
            
            const startDate = new Date(
              parseInt(eventDateParts[0]), 
              parseInt(eventDateParts[1]) - 1, 
              parseInt(eventDateParts[2]),
              parseInt(startTimeParts[0]),
              parseInt(startTimeParts[1]),
              parseInt(startTimeParts[2])
            );
            
            const endDate = new Date(
              parseInt(eventDateParts[0]), 
              parseInt(eventDateParts[1]) - 1, 
              parseInt(eventDateParts[2]),
              parseInt(endTimeParts[0]),
              parseInt(endTimeParts[1]),
              parseInt(endTimeParts[2])
            );
            
            const addedEvent = {
              ...savedEvent,
              start: startDate,
              end: endDate,
              title: savedEvent.eventTitle,
              category: savedEvent.eventType,
              color: "#B8B8FF",
            };
            handleAddEvent(addedEvent);
            setNewEvent({ title: '', start: '', end: '', category: '' });
            onClose();
          } else {
            const error = await res.json();
            console.error("Server error:", error);
            showSnackbar("Failed to add event.", "error");
          }
        } catch (err) {
          console.error("Network error:", err);
          showSnackbar("An error occurred while adding the event.", "error");
        }
    };  
    
    const handleEditSubmit = async () => {
      if (!newEvent.title || !newEvent.start || !newEvent.end || !newEvent.category) {
        showSnackbar("Please fill out all fields.", "error");
        return;
      }

      // Parse the input date-time values as local dates
      const startDate = new Date(newEvent.start);
      const endDate = new Date(newEvent.end);

      // Format the date as YYYY-MM-DD
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      // Format time as HH:MM:SS
      const formatTime = (date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
      };

      // Prepare event data with properly formatted date and times
      const eventToUpdate = {
        userId: user.id,
        title: newEvent.title,
        eventDate: formatDate(startDate),
        startTime: formatTime(startDate),
        endTime: formatTime(endDate),
        category: newEvent.category,
      };
    
      try {
        const eventId = selectedEvent.id || selectedEvent.eventId;
        
        const res = await fetch(`${backendUrl}/api/planner-events/${eventId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventToUpdate),
        });
    
        if (res.ok) {
          const savedEvent = await res.json();
          // Create proper date objects for the added event
          const eventDateParts = savedEvent.eventDate.split('-');
          const startTimeParts = savedEvent.startTime.split(':');
          const endTimeParts = savedEvent.endTime.split(':');
          
          const startDate = new Date(
            parseInt(eventDateParts[0]), 
            parseInt(eventDateParts[1]) - 1, 
            parseInt(eventDateParts[2]),
            parseInt(startTimeParts[0]),
            parseInt(startTimeParts[1]),
            parseInt(startTimeParts[2])
          );
          
          const endDate = new Date(
            parseInt(eventDateParts[0]), 
            parseInt(eventDateParts[1]) - 1, 
            parseInt(eventDateParts[2]),
            parseInt(endTimeParts[0]),
            parseInt(endTimeParts[1]),
            parseInt(endTimeParts[2])
          );
          
          const editedEvent = {
            ...savedEvent,
            start: startDate,
            end: endDate,
            title: savedEvent.eventTitle,
            category: savedEvent.eventType,
            color: "#B8B8FF",
          };
          handleEditEvent(editedEvent);
          setNewEvent({ title: '', start: '', end: '', category: '' });
          onClose();
        } else {
          const error = await res.json();
          console.error("Server error:", error);
          showSnackbar("Failed to add event.", "error");
        }
      } catch (err) {
        console.error("Network error:", err);
        showSnackbar("An error occurred while adding the event.", "error");
      }
  };

    return (
        <div>
            <Box>
              <SimpleSnackbar
                open={snackbar.open}
                onClose={hideSnackbar}
                message={snackbar.message}
                severity={snackbar.severity}
                duration={4000}
              />
              <Modal open={open} onClose={onClose}>
                <Box sx={style}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {isEditing ? 'Edit Event' : 'Add an Event to your Planner'}
                  </Typography>
                  
                  <TextField fullWidth label="Event Title" name="title" value={newEvent.title || ""} onChange={handleChange} sx={{ my: 1 }} />
                  <TextField fullWidth label="Start Time and Date" type="datetime-local" name="start" value={newEvent.start || ""} onChange={handleChange} slotProps={{inputLabel: {shrink: true}}} sx={{ my: 1 }} />
                  <TextField fullWidth label="End Time and Date" type="datetime-local" name="end" value={newEvent.end || ""} onChange={handleChange} slotProps={{inputLabel: {shrink: true}}} sx={{ my: 1 }} />
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                        labelId="category-label"
                        id="category-select"
                        name="category"
                        label="Category"
                        value={newEvent.category || ""}
                        onChange={handleChange}
                    >
                        <MenuItem value="Assignment">Assignment</MenuItem>
                        <MenuItem value="Exam">Exam</MenuItem>
                        <MenuItem value="Class">Class</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={onClose} color="error">Cancel</Button>
                    <Button onClick={isEditing ? handleEditSubmit : handleSubmit} color="primary" variant="contained">
                      {isEditing ? 'Edit Event' : 'Add Event'}
                    </Button>
                  </Box>
                </Box>
              </Modal>
            </Box>
        </div>
    )
}

export default CreateEventModal
