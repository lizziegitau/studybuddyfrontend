import { useState, useEffect } from 'react'
import '../App.css'
import { Box, InputLabel, MenuItem, FormControl, Select, Typography, Modal, Button  } from '@mui/material';

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

function DailyGoalModal ({ open, onClose, dailyGoal, setDailyGoal }) {

    const [tempGoal, setTempGoal] = useState('');

    useEffect(() => {
        if (open) {
          setTempGoal(dailyGoal);
        }
      }, [open, dailyGoal]);

    const handleSave = () => {
        setDailyGoal(tempGoal);
        onClose();
      };

    return (
        <div>
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
                            Save
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

export default DailyGoalModal