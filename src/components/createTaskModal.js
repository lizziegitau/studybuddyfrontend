import { useState } from 'react';
import { Box, TextField, MenuItem, Typography, Modal, Button, FormControl, InputLabel, Select } from '@mui/material';
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

function CreateTaskModal({ open, onClose, onSave }) {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const { user } = useUser();
  const [task, setTask] = useState({
    taskDescription: '',
    taskStatus: 'To-Do',
    dueDate: '',
    priority: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!task.taskDescription || !task.dueDate || !task.priority || !task.taskStatus) {
      showSnackbar("Please fill all required fields.", "error");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const payload = {
        userId: user.id,
        ...task
      };
      
      const response = await fetch(`${backendUrl}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      
      const savedTask = await response.json();
      
      if (onSave) {
        onSave(savedTask);
      }
      
      setTask({ taskDescription: '', taskStatus: 'To-Do', dueDate: '' });
      showSnackbar("Task created successfully!", "success");
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Error saving task:', error);
      showSnackbar("Failed to save task. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
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
      <Modal open={open} onClose={onClose}>
        <Box sx={style}>
          <Typography variant="h6" sx={{ mb: 2 }}>Create a Task</Typography>
          
          <TextField
            fullWidth
            label="Task Description"
            name="taskDescription"
            value={task.taskDescription}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              id="status-select"
              name="taskStatus"
              label="Status"
              value={task.taskStatus}
              onChange={handleChange}
            >
              <MenuItem value="To-Do">To-Do</MenuItem>
              <MenuItem value="In-Progress">In-Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="Due Date"
            type="date"
            name="dueDate"
            value={task.dueDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
            required
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select
              labelId="priority-label"
              id="priority-select"
              name="priority"
              label="Priority"
              value={task.priority}
              onChange={handleChange}
            >
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSave}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
            <Button variant="outlined" color="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default CreateTaskModal;
