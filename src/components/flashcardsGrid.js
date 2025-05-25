import { useState, useEffect } from "react";
import { Box, Button, Card, CardContent, Typography, Divider, Tooltip, IconButton, Fab } from "@mui/material";
import Grid from '@mui/material/Grid2';
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import StudyMode from './flashcardsStudyMode';
import AddFlashcardModal from "./addFlashcard";
import EditFlashcardModal from "./editFlashcard";
import { useUser } from "@clerk/clerk-react";
import SimpleSnackbar from "./snackbar";

const FlashcardGrid = ({ folder, onBack, setOpenCreateFlashcardModal, fetchFlashcards, isFlashcardsLoading, setIsFlashcardsLoading, selectedFiles  }) => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [studyMode, setStudyMode] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedFlashcard, setSelectedFlashcard] = useState(null);
  const [deckFlashcards, setDeckFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
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
    const getFlashcards = async () => {
      setLoading(true);
      const cards = await fetchFlashcards();
      const filtered = (cards || []).filter(card => card.deckId === folder.deckId);
      setDeckFlashcards(filtered);
      setLoading(false);
    };
    getFlashcards();
  }, [folder.deckId, fetchFlashcards]);

  if (studyMode) {
    return (
      <StudyMode  
        flashcards={deckFlashcards}
        deckName={folder.deckName}
        onBack={() => setStudyMode(false)} 
      />
    );
  }

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6">Loading flashcards...</Typography>
      </Box>
    );
  }

  const handleAddFlashcard = async (newFlashcard) => {
    try {
      const res = await fetch(`${backendUrl}/api/flashcards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...newFlashcard, userId: user.id}),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add flashcard');
      }
  
      const createdFlashcard = await res.json();
      setDeckFlashcards(prev => [...prev, createdFlashcard]);

      showSnackbar("Flashcard added successfully.", "success");
  
    } catch (error) {
      showSnackbar("Error adding flashcard.", "error");
      console.error('Add flashcard error:', error.message);
    }
  };

  const handleEditFlashcard = async (updatedFlashcard) => {
    try {
      const res = await fetch(`${backendUrl}/api/flashcards/${updatedFlashcard.flashcardId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: updatedFlashcard.question,
          answer: updatedFlashcard.answer,
        }),
      });
  
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update flashcard');
      }
  
      setDeckFlashcards(prev =>
        prev.map(card => (card.flashcardId === updatedFlashcard.flashcardId ? updatedFlashcard : card))
      );
      showSnackbar("Flashcard updated successfully.", "success");
    } catch (error) {
      showSnackbar("Error editing flashcard.", "error");
      console.error('Update error:', error);
    }
  };
  
  const handleDeleteFlashcard = async (flashcardId) => {
  
    try {
      const res = await fetch(`${backendUrl}/api/flashcards/${flashcardId}`, {
        method: 'DELETE',
      });
  
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete flashcard');
      }
  
      setDeckFlashcards(prev => prev.filter(card => card.flashcardId !== flashcardId));
      showSnackbar("Flashcard deleted successfully.", "success");
    } catch (error) {
      showSnackbar("Error deleting flashcard.", "error");
      console.error('Delete error:', error);
    }
  };

  const handleGenerateFlashcards = async () => {
    try {
      setIsFlashcardsLoading(true);
      
      const formData = new FormData();
      
      formData.append("userId", user.id);
      formData.append("deckId", folder.deckId);
      
      if (selectedFiles && selectedFiles.length > 0) {
        selectedFiles.forEach((file) => formData.append("files", file));
      }
      
      const response = await fetch(`${backendUrl}/api/flashcards/generate-flashcards`, {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate flashcards");
      }
  
      await response.json();
      
      const updated = await fetchFlashcards();
      setDeckFlashcards(updated.filter(card => card.deckId === folder.deckId));
      
      setIsFlashcardsLoading(false);
      showSnackbar("Flashcards generated successfully.", "success");
      
    } catch (err) {
      console.error("Flashcard generation failed:", err);
      showSnackbar("Flashcard generation failed.", "error");
      setIsFlashcardsLoading(false);
    }
  };
  
    return (
      <Box sx={{ p:4, width: '100%' }}>
        <SimpleSnackbar
            open={snackbar.open}
            onClose={hideSnackbar}
            message={snackbar.message}
            severity={snackbar.severity}
            duration={4000}
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Tooltip title="Back to Decks" arrow>
            <IconButton onClick={onBack} sx={{ color: "#9381FF" }} >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>

          <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ flexGrow: 1 }}>
            Flashcards in {folder.deckName}
          </Typography>

          <Button variant="contained" sx={{ backgroundColor: "#9381FF", visibility: deckFlashcards.length === 0 ? 'hidden' : 'visible' }} onClick={() => setStudyMode(true)}>
            Start Studying
          </Button>
        </Box>

        {deckFlashcards.length === 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',minHeight: '50vh', textAlign: 'center', p: 3}}>
          <Card key={deckFlashcards.flashcardId} sx={{ p: 4, maxWidth: 500, width: '100%', backgroundColor: "#F8F7FF", borderRadius: "20px", display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <Typography variant="h5" color="text.secondary">
              You don't have any flashcards in this deck yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Create your first flashcard to start studying
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              onClick={() => setOpenCreateFlashcardModal(true)}
              sx={{ backgroundColor: "#9381FF" }}
            >
              Create Flashcard
            </Button>
          </Card>
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ width: '100%' }} columns={{ xs: 12, sm: 12, md: 12, lg: 12 }} >
        {deckFlashcards.map((flashcard) => (
          <Grid key={flashcard.flashcardId} size={{xs: 12, sm: 6, lg: 3}}>
            <Card key={flashcard.flashcardId} sx={{ margin: '0 auto', padding: 2, textAlign: "center", backgroundColor: "#F8F7FF", width: "100%", minHeight: "300px", borderRadius: "20px", position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>

                <Box sx={{position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: 1 }}>
                <IconButton size="small" onClick={() => {setOpenEditModal(true); setSelectedFlashcard(flashcard);}}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDeleteFlashcard(flashcard.flashcardId)} color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>

                <CardContent sx={{ width: "100%" }} >
                  <Typography variant="body1" sx={{ pb: 1 }}>{flashcard.question}</Typography>
                  <Divider sx={{ width: "80%", mx: "auto", my: 2 }} />
                  <Typography variant="body1" sx={{ pt: 1 }}>{flashcard.answer}</Typography>
              </CardContent>
            </Card>
            </Grid>
          ))}
          <Grid size={{xs: 12, sm: 6, lg: 3}}>
            <Card  sx={{ margin: '0 auto', padding: 2, textAlign: "center", backgroundColor: "#F8F7FF", width: "100%", minHeight: "300px", borderRadius: "20px", position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <CardContent sx={{ width: "100%" }} >
                <Typography variant="body1" sx={{ pb: 1 }}>Click the button below to generate more flashcards</Typography>
                <Divider sx={{ width: "80%", mx: "auto", my: 2 }} />
                <Button variant="contained" sx={{backgroundColor: '#9381FF', pt: 1}} onClick={handleGenerateFlashcards} disabled={isFlashcardsLoading} >{isFlashcardsLoading ? 'Generating...' : 'Generate More'}</Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

        <Fab
          aria-label="add"
          style={{
              backgroundColor: "#9381FF",
              color: "white",
              position: "fixed",
              bottom: "20px",
              right: "40px",
              zIndex: 1000
            }}
            onClick={() => setOpenAddModal(true)}
        >
          <AddIcon />
        </Fab>

        <AddFlashcardModal open={openAddModal} onClose={() => setOpenAddModal(false)} folder={folder} onAddFlashcard={handleAddFlashcard} />

        <EditFlashcardModal open={openEditModal} onClose={() => setOpenEditModal(false)} flashcard={selectedFlashcard} onUpdateFlashcard={handleEditFlashcard} />

      </Box>
    );
};

export default FlashcardGrid