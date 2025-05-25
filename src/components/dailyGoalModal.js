import { useState, useEffect } from 'react'
import '../App.css'
import { Box, InputLabel, MenuItem, FormControl, Select, Typography, Modal, Button, CircularProgress } from '@mui/material';
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

function DailyGoalModal ({ open, onClose, dailyGoal, setDailyGoal, userId }) {

    const [tempGoal, setTempGoal] = useState('');
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

    useEffect(() => {
        if (open) {
          setTempGoal(dailyGoal);
        }
      }, [open, dailyGoal]);

      const handleSave = async () => {
        if (!userId || !tempGoal) {
          showSnackbar("Please fill all required fields.", "error");
          return;
        }
    
        setIsSubmitting(true);
    
        try {
          const response = await fetch('/api/daily-goal', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: userId,
              dailyGoalMinutes: tempGoal,
            }),
          });
    
          if (!response.ok) {
            throw new Error('Failed to save daily goal');
          }
    
          const data = await response.json();
          setDailyGoal(data.dailyGoalMinutes);
          showSnackbar("Daily goal saved successfully!", "success");
          setTimeout(() => {
            onClose();
          }, 1500);
        } catch (error) {
          console.error('Error saving goal:', error);
          showSnackbar("Failed to save goal. Please try again.", "error");
          alert('Failed to save goal. Please try again.');
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
                    <Typography variant="h6" sx={{ mb: 2 }}>Edit your daily goal</Typography>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="demo-simple-select-label">Daily goal</InputLabel>
                        <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Daily Goal" value={tempGoal} onChange={(e) => setTempGoal(e.target.value)}>
                            <MenuItem value={30}>30 minutes</MenuItem>
                            <MenuItem value={60}>1 hour</MenuItem>
                            <MenuItem value={90}>1 hour 30 minutes</MenuItem>
                            <MenuItem value={120}>2 hours</MenuItem>
                            <MenuItem value={150}>2 hours 30 minutes</MenuItem>
                            <MenuItem value={180}>3 hours</MenuItem>
                            <MenuItem value={210}>3 hours 30 minutes</MenuItem>
                            <MenuItem value={240}>4 hours</MenuItem>
                            <MenuItem value={300}>5 hours</MenuItem>
                            <MenuItem value={360}>6 hours</MenuItem>
                            <MenuItem value={420}>7 hours</MenuItem>
                            <MenuItem value={480}>8 hours</MenuItem>
                        </Select>
                    </FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="contained" color="primary" onClick={handleSave}>
                          {isSubmitting ? <CircularProgress size={24} /> : 'Save'}
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    )
}

export default DailyGoalModal;
