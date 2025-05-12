import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import FlashcardGrid from '../components/flashcardsGrid';
import FoldersLanding from "../components/foldersLanding";
import FlashcardFolderModal from "../components/createFolderModal.js";
import CreateFlashcardModal from "../components/createFlashcardModal";
import WelcomeCard from "../components/welcomeCard";
import { useUser } from "@clerk/clerk-react";
import SimpleSnackbar from "../components/snackbar.js";

const Flashcards = () => {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [openFlashcardModal, setOpenFlashcardModal] = useState(false);
  const [openCreateFlashcardModal, setOpenCreateFlashcardModal] = useState(false);
  const { user } = useUser();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isFlashcardsLoading, setIsFlashcardsLoading] = useState(false);
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
    if (user?.id || selectedFolder === null) {
        const fetchDecks = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/decks/${user.id}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch decks');
                }

                const data = await response.json();
                setFolders(data);
                showSnackbar("Folders loaded successfully!", "success");
            } catch (err) {
                console.error('Error fetching decks:', err);
                setFolders([]);
                showSnackbar("Failed to load decks. Please try again later.", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchDecks();
    }
}, [user, selectedFolder]);

  const handleSaveFolder = (newFolder) => {
    setFolders((prev) => [newFolder, ...prev]);
    showSnackbar("Folder created successfully!", "success");
  };

  const handleFolderDelete = (deletedFolderId) => {
    setFolders(prevFolders => prevFolders.filter(folder => folder.deckId !== deletedFolderId));
};

  const generateFlashcards = async (selectedFiles) => {
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));

    formData.append("userId", user.id);
    formData.append("deckId", selectedFolder?.deckId);
  
    try {
      const response = await fetch("/api/flashcards/generate-flashcards", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to generate flashcards");
      }
  
      const data = await response.json();
      showSnackbar("Flashcards generated successfully!", "success");
      return data;

    } catch (err) {
      console.error("Error generating flashcards:", err);
      showSnackbar("Error generating flashcards.", "error");
      throw err;
    }
  };  
  
  const fetchFlashcards = async () => {
    const userId = user.id;
    const deckId = selectedFolder.deckId;
    try {
      const response = await fetch(`/api/flashcards/${userId}/${deckId}`);
      const data = await response.json();
  
      if (response.ok) {
        showSnackbar("Flashcards loaded successfully!", "success");
        return data.flashcards;
      } else {
        console.error("Error fetching flashcards:", data.error);
        showSnackbar("Error fetching flashcards.", "error");
      }
    } catch (error) {
      console.error("Network error:", error);
      showSnackbar("Cannot fetch flashcards. Please try again.", "error");
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
      <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: '#FFEEDD' }}>
        <Box display='flex' alignItems='center' justifyContent='flex-start' mb={3}>
          <Typography variant='h5' fontWeight='bold' sx={{ textTransform: 'capitalize'}} >{user.username}'s Flashcards</Typography>
        </Box>

        <WelcomeCard/>

          {selectedFolder ? (
            <FlashcardGrid folder={selectedFolder} onBack={() => setSelectedFolder(null)} setOpenCreateFlashcardModal={setOpenCreateFlashcardModal} fetchFlashcards={fetchFlashcards} isFlashcardsLoading={isFlashcardsLoading} setIsFlashcardsLoading={setIsFlashcardsLoading} selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />
          ) : (
            loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                  <CircularProgress />
              </Box>
          ) : (
              <FoldersLanding folders={folders} setSelectedFolder={setSelectedFolder} setOpenFlashcardModal={setOpenFlashcardModal} onFolderDelete={handleFolderDelete} />
          ))}
          <FlashcardFolderModal open={openFlashcardModal} onClose={() => setOpenFlashcardModal(false)} onSave={handleSaveFolder} />
          <CreateFlashcardModal open={openCreateFlashcardModal} onClose={() => setOpenCreateFlashcardModal(false)} generateFlashcards={generateFlashcards} isFlashcardsLoading={isFlashcardsLoading} setIsFlashcardsLoading={setIsFlashcardsLoading} selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />

      </Box>
    </div>
  );
};

export default Flashcards;
