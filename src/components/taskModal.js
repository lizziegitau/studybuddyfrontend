import '../App.css';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

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

function TaskModal({ open, onClose, selectedTask }) {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6">
                    {selectedTask ? selectedTask.title : 'Task Details'}
                </Typography>
                <Typography variant="body1">
                    {selectedTask ? selectedTask.description : 'No task selected'}
                </Typography>
            </Box>
        </Modal>
    );
}

export default TaskModal;
