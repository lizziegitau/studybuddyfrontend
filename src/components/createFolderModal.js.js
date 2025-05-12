import { useState } from "react";
import { Box, Typography, Modal, TextField, Button } from "@mui/material";
import { Folder } from "@mui/icons-material";
import { useUser } from "@clerk/clerk-react";
import SimpleSnackbar from "./snackbar";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
  borderRadius: "10px",
};


function FlashcardFolderModal({ open, onClose, onSave }) {
  const { user } = useUser();
  const [folderName, setFolderName] = useState("");
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

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      showSnackbar("Please enter a folder name.", "error");
      return;
    }
  
    try {
      const payload = {
        userId: user.id,
        deckName: folderName.trim()
      };
  
      const response = await fetch('/api/decks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create folder');
      }

      const savedFolder = await response.json();

      if (onSave) {
        onSave(savedFolder);
      }
  
      setFolderName('');
      showSnackbar("Folder created successfully!", "success");
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error) {
      console.error('Error creating folder:', error);
      showSnackbar("Failed to create folder. Please try again.", "error");
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
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              Create a new folder
            </Typography>
          </Box>

          <Typography variant="body1" mt={2} fontWeight="medium">
            Name
          </Typography>
          <TextField
            fullWidth
            placeholder="My new Folder!"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            InputProps={{
              startAdornment: <Folder sx={{ marginRight: 1 }} />,
            }}
            sx={{ mt: 1 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <Button variant="contained" color="primary" onClick={handleCreateFolder}>
              Create Folder
            </Button>
            <Button variant="outlined" color="secondary" onClick={onClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default FlashcardFolderModal;
