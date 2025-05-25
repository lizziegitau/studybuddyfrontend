import '../App.css';
import { useState, useEffect } from 'react';
import { Box, Typography, Modal, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
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
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

function TaskModal({ open, onClose, task, onSave, setIsEditing }) {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [editedTask, setEditedTask] = useState({ taskDescription: '', taskStatus: '', dueDate: '', priority: '' });
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    if (task) {
      setEditedTask(task);
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      const updatedTask = {
        taskDescription: editedTask.taskDescription,
        taskStatus: editedTask.taskStatus,
        dueDate: editedTask.dueDate,
        priority: editedTask.priority
      };

      const response = await fetch(`${backendUrl}/api/tasks/${task.taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      
      const savedTask = await response.json();
      
      onSave(savedTask);

      showSnackbar("Task updated successfully!", "success");

      setIsEditing(false);
      onClose();
    } catch (err) {
      console.error('Error updating task:', err);
      showSnackbar("Failed to update task. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
    onClose();
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
          <Typography variant="h6" sx={{ mb: 2 }}>
            Edit Task
          </Typography>

              <Box>
                  <TextField
                      label="Title"
                      name="taskDescription"
                      value={editedTask.taskDescription || ''}
                      onChange={handleChange}
                      fullWidth
                      sx={{ mb: 2 }}
                  />
                  <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel id="status-label">Status</InputLabel>
                      <Select
                          labelId="status-label"
                          id="status-select"
                          name="taskStatus"
                          label="Status"
                          value={editedTask.taskStatus || ''}
                          onChange={handleChange}
                      >
                          <MenuItem value="To-Do">To-Do</MenuItem>
                          <MenuItem value="In-Progress">In-Progress</MenuItem>
                          <MenuItem value="Completed">Completed</MenuItem>
                      </Select>
                  </FormControl>

                  <TextField
                      label="Due Date"
                      name="dueDate"
                      type="date"
                      value={editedTask.dueDate ? editedTask.dueDate.slice(0, 10) : ''}
                      onChange={handleChange}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      sx={{ mb: 2 }}
                  />

                  <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel id="priority-label">Priority</InputLabel>
                      <Select
                          labelId="priority-label"
                          id="priority-select"
                          name="priority"
                          label="Priority"
                          value={editedTask.priority || ''}
                          onChange={handleChange}
                      >
                          <MenuItem value="High">High</MenuItem>
                          <MenuItem value="Medium">Medium</MenuItem>
                          <MenuItem value="Low">Low</MenuItem>
                      </Select>
                  </FormControl>

                  <Box display="flex" justifyContent="space-between" mt={2}>
                    <Button variant="outlined" color="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        {isLoading ? 'Saving...' : 'Save'}
                    </Button>
                  </Box>
              </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default TaskModal;
