import { useState } from 'react';
import '../App.css';
import { Box, Typography, Modal, Button, Checkbox, List, ListItem, ListItemText } from '@mui/material';
import { tasks } from '../taskData'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxHeight: '80vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '10px',
};

function TimerTaskModal({ open, onClose, onAddTasks }) {

    const [selectedTasks, setSelectedTasks] = useState([]);
    const incompleteTasks = tasks.filter(task => !task.done);

    const handleTaskToggle = (taskId) => {
      setSelectedTasks((prevSelected) =>
        prevSelected.includes(taskId)
          ? prevSelected.filter((id) => id !== taskId)
          : [...prevSelected, taskId]
      );
    };
  
    const handleAddTasks = () => {
      onAddTasks(selectedTasks);
      onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6">Select Tasks</Typography>
                <Box sx={{maxHeight: '50vh', overflowY: 'auto', mt: 2}}>
                    {incompleteTasks.length > 0 ? (
                        <List>
                            {incompleteTasks.map((task) => (
                                <ListItem key={task.id} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Checkbox
                                        checked={selectedTasks.includes(task.id)}
                                        onChange={() => handleTaskToggle(task.id)}
                                    />
                                    <ListItemText
                                        primary={task.title}
                                        secondary={task.description}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            No tasks available.
                        </Typography>
                    )}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={onClose} color="secondary">Cancel</Button>
                    <Button onClick={handleAddTasks} color="primary" variant="contained" sx={{ ml: 2 }}>Add</Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default TimerTaskModal;
