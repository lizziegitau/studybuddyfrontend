import { useState, useEffect } from "react";
import { Box, Typography, Modal, TextField, Button, CircularProgress } from "@mui/material";
import { Folder } from "@mui/icons-material";
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

function EditFolderModal({ open, onClose, folder, onSave }) {
  const [folderName, setFolderName] = useState("");
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
    if (folder && folder.deckName) {
      setFolderName(folder.deckName);
    }
  }, [folder]);

  const handleSave = () => {
    if (!folderName.trim()) {
      showSnackbar("Folder name cannot be empty.", "error");
      return;
    }

    if (!folder || !folder.deckId) {
      showSnackbar("Invalid folder data.", "error");
      return;
    }

    setIsSubmitting(true);

    onSave({
      deckId: folder.deckId,
      deckName: folderName,
      cardCount: folder.flashcardCount
    });

    setIsSubmitting(false);
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
              Edit Folder
            </Typography>
          </Box>

          <Typography variant="body1" mt={2} fontWeight="medium">
            Name
          </Typography>
          <TextField
            fullWidth
            placeholder="Folder Name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            InputProps={{
              startAdornment: <Folder sx={{ marginRight: 1 }} />,
            }}
            sx={{ mt: 1 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSave} disabled={isSubmitting || !folder?.deckId} startIcon={isSubmitting ? <CircularProgress size={20} /> : null}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
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

export default EditFolderModal;
