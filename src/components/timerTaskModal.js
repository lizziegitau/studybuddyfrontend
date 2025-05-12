import { useState } from 'react';
import '../App.css';
import { Box, Typography, Modal, Button, Checkbox, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  maxHeight: '80vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '10px',
};

function TimerTaskModal({ open, onClose, onAddTasks, tasks, loading }) {

    const [selectedTasks, setSelectedTasks] = useState([]);
    const incompleteTasks = tasks.filter(task => (task.taskStatus === 'To-Do' || task.taskStatus === 'In-Progress'));

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
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box sx={{maxHeight: '50vh', overflowY: 'auto', mt: 2}}>
                        {incompleteTasks.length > 0 ? (
                            <List>
                                {incompleteTasks.map((task) => {
                                    const formattedDueDate = new Date(task.dueDate).toLocaleDateString(undefined, {
                                        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                                    });
                                    return (
                                    <ListItem key={task.taskId} sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Checkbox
                                            checked={selectedTasks.includes(task.taskId)}
                                            onChange={() => handleTaskToggle(task.taskId)}
                                        />
                                        <ListItemText
                                            primary={task.taskDescription}
                                        />
                                        <ListItemText
                                            primary={formattedDueDate}
                                        />
                                        <ListItemText
                                            primary={task.priority}
                                        />
                                    </ListItem>
                                    )
                                })}
                            </List>
                        ) : (
                            <Typography variant="body2" color="textSecondary">
                                No tasks available.
                            </Typography>
                        )}
                    </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={onClose} color="secondary">Cancel</Button>
                    <Button onClick={handleAddTasks} color="primary" variant="contained" sx={{ ml: 2 }}>Add</Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default TimerTaskModal;
