import { useState } from "react";
import { Box, Typography, Modal, TextField, Button, IconButton } from "@mui/material";
import { Close, Folder } from "@mui/icons-material";

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

const colors = ["#E76F51", "#F4A261", "#2A9D8F", "#264653", "#E9C46A", "#457B9D", "#1D3557", "#A8DADC", "#8E44AD", "#C0392B"];

function FlashcardFolderModal({ open, onClose }) {
  const [folderName, setFolderName] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            Create a new folder
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
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

        <Typography variant="body1" mt={3} fontWeight="medium">
          Color
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
          {colors.map((color) => (
            <IconButton
              key={color}
              onClick={() => setSelectedColor(color)}
              sx={{
                bgcolor: color,
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: selectedColor === color ? "3px solid white" : "none",
              }}
            />
          ))}
        </Box>

        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, borderRadius: "8px" }}
          disabled={!folderName || !selectedColor}
        >
          Create Folder
        </Button>
      </Box>
    </Modal>
  );
}

export default FlashcardFolderModal;
