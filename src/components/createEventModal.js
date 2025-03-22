import '../App.css';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

function CreateEventModal ({newEvent, setNewEvent, open, onClose, handleAddEvent}) {

    const handleChange = (e) => setNewEvent({ ...newEvent, [e.target.name]: e.target.value });

    return (
        <div>
            <Box>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Add Study Event</DialogTitle>
                <DialogContent>
                    <TextField fullWidth label="Event Title" name="title" onChange={handleChange} sx={{ my: 1 }} />
                    <TextField fullWidth type="datetime-local" name="start" onChange={handleChange} sx={{ my: 1 }} />
                    <TextField fullWidth type="datetime-local" name="end" onChange={handleChange} sx={{ my: 1 }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="error">Cancel</Button>
                    <Button onClick={handleAddEvent} color="primary" variant="contained">Add Event</Button>
                </DialogActions>
            </Dialog>
            </Box>
        </div>
    )
}

export default CreateEventModal