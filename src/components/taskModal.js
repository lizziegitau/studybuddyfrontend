import '../App.css';
import { useState, useEffect } from 'react';
import { Box, Typography, Modal, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

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

function TaskModal({ open, onClose, task, onSave }) {
    console.log(task)
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ title: '', status: '', dueDate: '', priority: '' });

  // Sync editedTask with selected task when modal opens
  useEffect(() => {
    if (task) {
      setEditedTask(task);
    }
  }, [task]);

  // Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Save
  const handleSave = () => {
    onSave(editedTask); // Pass the updated task back
    setIsEditing(false);
  };

  // Handle Cancel (reset to original task)
  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {isEditing ? 'Edit Task' : task?.title || 'Task Details'}
        </Typography>

        {isEditing ? (
            <Box>
                <TextField
                    label="Title"
                    name="title"
                    value={editedTask.title || ''}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        name="status"
                        value={editedTask.status || ''}
                        onChange={handleChange}
                    >
                        <MenuItem value="To-Do">To-Do</MenuItem>
                        <MenuItem value="In-Progress">In-Progress</MenuItem>
                        <MenuItem value="Done">Done</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    label="Due Date"
                    name="dueDate"
                    type="date"
                    value={editedTask.dueDate || ''}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2 }}
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Priority</InputLabel>
                    <Select
                        name="priority"
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
                    Save
                </Button>
                </Box>
            </Box>
        ) : (
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}><strong>Status:</strong> {task?.status || 'No task selected'}</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}><strong>Due Date:</strong> {task?.dueDate || 'No task selected'}</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}><strong>Priority:</strong> {task?.priority || 'No task selected'}</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsEditing(true)}
              sx={{ mt: 2 }}
            >
              Edit
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
}

export default TaskModal;
