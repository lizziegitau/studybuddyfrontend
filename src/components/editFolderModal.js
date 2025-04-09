import { useState, useEffect } from "react";
import { Box, Typography, Modal, TextField, Button } from "@mui/material";
import { Folder } from "@mui/icons-material";

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

  useEffect(() => {
    if (folder) {
      setFolderName(folder.deckName);
    }
  }, [folder]);

  const handleSave = () => {
    onSave({ ...folder, name: folderName });
    onClose();
  };

  return (
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
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Changes
          </Button>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default EditFolderModal;