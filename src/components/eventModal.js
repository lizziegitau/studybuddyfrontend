import '../App.css';
import { useState } from 'react';
import { Box, Typography, Modal, Button } from "@mui/material";
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

const EventModal = ({selectedEvent, open, onClose, setOpenEventModal, setIsEditing, setNewEvent, onEventDeleted}) => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const [isDeleting, setIsDeleting] = useState(false);
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

    // Format date objects to strings
    const formatDateTime = (dateTime) => {
        if (!dateTime) return "Not specified";
        
        // Check if dateTime is a Date object
        const date = dateTime instanceof Date ? dateTime : new Date(dateTime);
        
        // Check if date is valid
        if (isNaN(date.getTime())) return "Invalid date";
        
        return date.toLocaleString();
    };

    const handleEdit = () => {

        const formatDateForInput = (date) => {
            return new Date(date).toISOString().slice(0, 16);
        };

        setNewEvent({
            title: selectedEvent.eventTitle || selectedEvent.title,
            start: formatDateForInput(selectedEvent.start),
            end: formatDateForInput(selectedEvent.end),
            category: selectedEvent.eventType || selectedEvent.category
          });
        setOpenEventModal(true);
        setIsEditing(true);
        onClose();
    };

    const handleDelete = async () => {
        if (!selectedEvent || (!selectedEvent.eventId && !selectedEvent.id)) {
            showSnackbar("Cannot delete: Missing event ID.", "error");
            return;
        }

        const eventId = selectedEvent.eventId || selectedEvent.id;
        
        try {
            setIsDeleting(true);
            
            const response = await fetch(`${backendUrl}/api/planner-events/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete event");
            }

            await response.json();
            showSnackbar("Event deleted successfully!", "success");
            setTimeout(() => {
                onClose();
            }, 1500);
            
            if (typeof onEventDeleted === 'function') {
                onEventDeleted(eventId);
            }
        } catch (error) {
            console.error("Error deleting event:", error);
            showSnackbar(error.message || "Failed to delete event. Please try again.", "error");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
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
                    <Typography variant="h6" sx={{ mb: 2 }}>Event Details</Typography>
                    <Typography sx={{ mb: 2 }}>Event Title: {selectedEvent?.title || "Not specified"}</Typography>
                    <Typography sx={{ mb: 2 }}>
                        Start Time and Date: {formatDateTime(selectedEvent?.start)}
                    </Typography>
                    <Typography sx={{ mb: 2 }}>
                        End Time and Date: {formatDateTime(selectedEvent?.end)}
                    </Typography>
                    <Typography sx={{ mb: 2 }}>
                        Category: {selectedEvent?.eventType || "Not specified"}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                        <Button onClick={handleDelete} color="error" disabled={isDeleting}>{isDeleting ? "Deleting..." : "Delete"}</Button>
                        <Button onClick={handleEdit} color="primary" variant="contained">Edit</Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    )
}

export default EventModal;
