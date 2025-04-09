import '../App.css';
import { Box, TextField, MenuItem, Typography, Modal, Button, FormControl, InputLabel, Select } from "@mui/material";

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

function CreateEventModal ({newEvent, setNewEvent, open, onClose, handleAddEvent}) {

    const handleChange = (e) => setNewEvent({ ...newEvent, [e.target.name]: e.target.value });

    const handleSubmit = () => {
        if (!newEvent.title || !newEvent.start || !newEvent.end) {
          alert("Please fill out all fields.");
          return;
        }
        handleAddEvent(newEvent);
        onClose();
      };

    return (
        <div>
            <Box>
                <Modal open={open} onClose={onClose}>
                    <Box sx={style}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Add an Event to your Planner</Typography>
                        
                        <TextField fullWidth label="Event Title" name="title" value={newEvent.title || ""} onChange={handleChange} sx={{ my: 1 }} />
                        <TextField fullWidth type="datetime-local" name="start" value={newEvent.start || ""} onChange={handleChange} sx={{ my: 1 }} />
                        <TextField fullWidth type="datetime-local" name="end" value={newEvent.end || ""} onChange={handleChange} sx={{ my: 1 }} />
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Category</InputLabel>
                            <Select
                                name="category"
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
                            <Button onClick={handleSubmit} color="primary" variant="contained">Add Event</Button>
                        </Box>
                    </Box>
                </Modal>
            </Box>
        </div>
    )
}

export default CreateEventModal