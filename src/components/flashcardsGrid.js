import { useState } from "react";
import { Box, Button, Card, CardContent, Typography, Divider, Tooltip, IconButton, Fab } from "@mui/material";
import Grid from '@mui/material/Grid2';
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import StudyMode from './flashcardsStudyMode';
import { flashcards } from "../flashcardData";

const FlashcardGrid = ({ folder, onBack }) => {
  const [studyMode, setStudyMode] = useState(false);
  const deckFlashcards = flashcards.filter(card => card.deckId === folder.deckId);

  if (studyMode) {
    return (
      <StudyMode  
        flashcards={deckFlashcards}
        deckName={folder.deckName}
        onBack={() => setStudyMode(false)} 
      />
    );
  }
  
    return (
      <Box sx={{ p:4, width: '100%' }}>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Tooltip title="Back to Decks" arrow>
            <IconButton onClick={onBack} sx={{ color: "#9381FF" }} >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>

          <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ flexGrow: 1 }}>
            Flashcards in {folder.deckName}
          </Typography>

          <Button variant="contained" sx={{ backgroundColor: "#9381FF" }} onClick={() => setStudyMode(true)}>
            Start Studying
          </Button>
        </Box>

        {deckFlashcards.length === 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',minHeight: '50vh', textAlign: 'center', p: 3}}>
          <Card sx={{ p: 4, maxWidth: 500, width: '100%', backgroundColor: "#F8F7FF", borderRadius: "20px", display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <Typography variant="h5" color="text.secondary">
              You don't have any flashcards in this deck yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Create your first flashcard to start studying
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              //onClick={handleAddFlashcard}
              sx={{ backgroundColor: "#9381FF" }}
            >
              Create Flashcard
            </Button>
          </Card>
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ width: '100%' }} columns={{ xs: 12, sm: 12, md: 12, lg: 12 }} >
        {deckFlashcards.map((flashcard) => (
          <Grid key={flashcard.id} size={{xs: 12, sm: 6, lg: 3}}>
            <Card key={flashcard.id} sx={{ margin: '0 auto', padding: 2, textAlign: "center", backgroundColor: "#F8F7FF", width: "100%", minHeight: "300px", borderRadius: "20px", position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>

                <Box sx={{position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: 1 }}>
                  <IconButton size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>

                <CardContent sx={{ width: "100%" }}>
                  <Typography variant="body1" sx={{ pb: 1 }}>{flashcard.question}</Typography>
                  <Divider sx={{ width: "80%", mx: "auto", my: 2 }} />
                  <Typography variant="body1" sx={{ pt: 1 }}>{flashcard.answer}</Typography>
              </CardContent>
            </Card>
            </Grid>
          ))}
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
        >
          <AddIcon />
        </Fab>

      </Box>
    );
};

export default FlashcardGrid