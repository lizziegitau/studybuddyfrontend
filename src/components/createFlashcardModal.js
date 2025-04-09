import { useState } from 'react';
import { Box, Typography, Modal, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/system";

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
  textAlign: 'center' // Centers all text
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

function CreateFlashcardModal({ open, onClose }) {
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Handles file selection
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles([...selectedFiles, ...files]);
  };

  // Handles file removal
  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
  };

  return (
    <Modal open={open} onClose={onClose}>
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

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="contained" color="primary" disabled={selectedFiles.length === 0}>
            Generate
          </Button>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default CreateFlashcardModal;
