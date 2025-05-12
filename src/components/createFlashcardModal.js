import '../App.css';
import { useState } from 'react';
import { Box, Typography, Modal, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/system";
import FlashcardLoading from './flashcardLoading';
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
  textAlign: 'center'
};

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function CreateFlashcardModal({ open, onClose, generateFlashcards, isFlashcardsLoading, setIsFlashcardsLoading, selectedFiles, setSelectedFiles }) {

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

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
  };

  const handleGenerateFlashcards = async () => {
    try {
      setIsFlashcardsLoading(true);
      await generateFlashcards(selectedFiles);
      setIsFlashcardsLoading(false);
      onClose();
    } catch (err) {
      console.error("Flashcard generation failed:", err);
      showSnackbar("Flashcard generation failed.", "error");
      setIsFlashcardsLoading(false);
    }
  }

  return (
    <div>
      <SimpleSnackbar
        open={snackbar.open}
        onClose={hideSnackbar}
        message={snackbar.message}
        severity={snackbar.severity}
        duration={4000}
      />
      <Modal open={open || isFlashcardsLoading} onClose={onClose}>
        {isFlashcardsLoading ? <FlashcardLoading /> : (
        <Box sx={style}>
          <Typography variant="h6" sx={{ mb: 2 }}>Create a New Deck</Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Upload your Word or PDF material and generate flashcards from your material.
          </Typography>

          {/* Upload Button - Centered */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
              Upload files
              <VisuallyHiddenInput type="file" onChange={handleFileChange} multiple accept=".pdf,.doc,.docx" />
            </Button>
          </Box>

          {/* File Type Info - Centered */}
          <Typography variant="body2" sx={{ mb: 3, color: 'gray' }}>
            Only PDF and Word documents are currently supported
          </Typography>

          {/* File Preview */}
          {selectedFiles.length > 0 && (
            <Box sx={{ mb: 3, textAlign: "left", maxHeight: "150px", overflowY: "auto" }}>
              <Typography variant="subtitle1" fontWeight="bold">Selected Files:</Typography>
              <List dense>
                {selectedFiles.map((file, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => removeFile(index)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={file.name} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button onClick={handleGenerateFlashcards} variant="contained" sx={{backgroundColor: '#9381FF', pt: 1}} disabled={selectedFiles.length === 0}>
              Generate
            </Button>
            <Button variant="outlined" color="secondary" onClick={onClose}>
              Cancel
            </Button>
          </Box>
        </Box>
        )}
      </Modal>
    </div>
  );
}

export default CreateFlashcardModal;
