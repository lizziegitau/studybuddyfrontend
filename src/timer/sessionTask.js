import { useState } from 'react'
import '../App.css';
import { Card, CardContent, Typography, List, ListItem, ListItemText, IconButton, Box } from "@mui/material";
import AddTaskIcon from '@mui/icons-material/AddTask';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import { styled } from "@mui/system";
import TimerTaskModal from '../components/timerTaskModal';
import { tasks } from '../taskData';

const StyledCard = styled(Card)({
    backgroundColor: "#F8F7FF",
    color: "#3E3E3E",
    borderRadius: "16px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    padding: "20px",
  });

function SessionTask () {

  const [openTaskModal, setOpenTaskModal] = useState(false)
  const [sessionTasks, setSessionTasks] = useState([]);

  const handleTaskOpen = () => {
      setOpenTaskModal(true);
  };

  const handleTaskClose = () => {
      setOpenTaskModal(false);
  };

  const handleAddTasks = (selectedTaskIds) => {
    const selectedTasks = tasks.filter((task) => selectedTaskIds.includes(task.id));
    setSessionTasks((prevTasks) => [...prevTasks, ...selectedTasks]);
  };

  const handleMarkAsDone = (taskId) => {
    setSessionTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId)); // Remove completed task
  };

  const handleRemoveTask = (taskId) => {
    setSessionTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

    return (
        <div>
            <StyledCard sx={{ mt: 3, position: 'relative' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" color="#9381FF">To Do</Typography>
              <IconButton sx={{ position: 'absolute', top: '10px', right: '10px' }} onClick={handleTaskOpen} >
                <AddTaskIcon sx={{ color: "#9381FF" }}/>
              </IconButton>
              <Typography variant="body2" color="textSecondary">
                  Sync tasks to your focus session.
              </Typography>
              <List>
                {sessionTasks.length > 0 ? (
                sessionTasks.map((task) => (
                  <ListItem key={task.id} secondaryAction={
                    <Box>
                      <IconButton edge="end" onClick={() => handleMarkAsDone(task.id)} sx={{ color: '#81C784' }}>
                        <CheckCircleIcon />
                      </IconButton>
                      <IconButton edge="end" onClick={() => handleRemoveTask(task.id)} color="error">
                        <ClearIcon />
                      </IconButton>
                    </Box>
                }>
                  <ListItemText primary={task.title} secondary={task.description} />
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                No tasks selected.
              </Typography>
            )}
          </List>
            </CardContent>
          </StyledCard>

          <TimerTaskModal open={openTaskModal} onClose={handleTaskClose} onAddTasks={handleAddTasks} />
        </div>
    )
}

export default SessionTask;