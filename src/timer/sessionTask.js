import { useState } from 'react'
import '../App.css';
import { Card, CardContent, Typography, List, ListItem, ListItemText, IconButton, Box } from "@mui/material";
import AddTaskIcon from '@mui/icons-material/AddTask';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import { styled } from "@mui/system";
import TimerTaskModal from '../components/timerTaskModal';
import SimpleSnackbar from '../components/snackbar';

const StyledCard = styled(Card)({
    backgroundColor: "#F8F7FF",
    color: "#3E3E3E",
    borderRadius: "16px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    padding: "20px",
  });

function SessionTask ({ tasks, sessionTasks, setSessionTasks, loading, handleAddTasks}) {
  const [openTaskModal, setOpenTaskModal] = useState(false);
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

  const handleTaskOpen = () => {
      setOpenTaskModal(true);
  };

  const handleTaskClose = () => {
      setOpenTaskModal(false);
  };

  
  const handleMarkAsDone = async (taskId) => {
    const sessionId = localStorage.getItem('lastSessionId');
    if (!sessionId) return;

    try {
      const res = await fetch(`/api/study-session/${sessionId}/task/${taskId}/complete`, {
        method: 'PATCH',
      });

      if (!res.ok) throw new Error('Failed to mark task as done');

      setSessionTasks((prevTasks) => 
        prevTasks.map((task) =>
          task.taskId === taskId ? { ...task, taskStatus: 'Completed' } : task
        )
      );
      showSnackbar("Successfully marked task as done!", "success");
    } catch (error) {
      console.error('Error marking task as done:', error);
      showSnackbar("Failed to mark task as done", "error");
    }
  };

  const handleRemoveTask = async (taskId) => {
    const sessionId = localStorage.getItem('lastSessionId');
    if (!sessionId) return;

    try {
      const res = await fetch(`/api/study-session/${sessionId}/task/${taskId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to remove task from session');

      setSessionTasks((prevTasks) => prevTasks.filter((task) => task.taskId !== taskId));
      showSnackbar("Session task removed successfully", "success");
    } catch (error) {
      console.error('Error removing task:', error);
      showSnackbar("Failed to remove session task", "error");
    }
  };

    return (
        <div>
          <SimpleSnackbar
              open={snackbar.open}
              onClose={hideSnackbar}
              message={snackbar.message}
              severity={snackbar.severity}
              duration={4000}
          />
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
                  <ListItem key={task.taskId} secondaryAction={
                    <Box>
                      <IconButton edge="end" onClick={() => handleMarkAsDone(task.taskId)} sx={{ color: '#81C784' }}>
                        <CheckCircleIcon />
                      </IconButton>
                      <IconButton edge="end" onClick={() => handleRemoveTask(task.taskId)} color="error">
                        <ClearIcon />
                      </IconButton>
                    </Box>
                  }>
                    <ListItemText primary={task.taskDescription} />
                    <ListItemText primary={task.taskStatus} />
                    <ListItemText primary={new Date(task.dueDate).toLocaleDateString()} />
                    <ListItemText primary={task.priority} />
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

          <TimerTaskModal open={openTaskModal} onClose={handleTaskClose} onAddTasks={handleAddTasks} tasks={tasks} loading={loading} />
        </div>
    )
}

export default SessionTask;
