import { useState, useEffect } from 'react';
import { Box, Typography, Modal, Button, TextField } from '@mui/material';

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
  textAlign: 'center'
};

function EditFlashcardModal({ open, onClose, flashcard, onUpdateFlashcard }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (flashcard) {
      setQuestion(flashcard.question);
      setAnswer(flashcard.answer);
    }
  }, [flashcard]);

  const handleUpdate = () => {
    if (question.trim() && answer.trim()) {
      onUpdateFlashcard({ ...flashcard, question, answer });
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" sx={{ mb: 2 }}>Edit Flashcard</Typography>
        <TextField fullWidth label="Question" value={question} onChange={(e) => setQuestion(e.target.value)} sx={{ mb: 2 }} />
        <TextField fullWidth label="Answer" value={answer} onChange={(e) => setAnswer(e.target.value)} sx={{ mb: 2 }} />
        <Button variant="contained" onClick={handleUpdate} sx={{ backgroundColor: "#9381FF", mr: 1 }}>Save</Button>
        <Button variant="outlined" onClick={onClose}>Cancel</Button>
      </Box>
    </Modal>
  );
};

export default EditFlashcardModal;
