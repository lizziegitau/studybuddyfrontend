import '../App.css';
import { useState } from 'react';
import { Box, Typography, IconButton, Card, Menu, MenuItem, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import FolderIcon from '@mui/icons-material/Folder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FlashcardsNoFolders from './flashcardsNoFolders';
import EditFolderModal from './editFolderModal';
import { flashcards } from "../flashcardData";

const DeckCard = styled(Card)(({ theme }) => ({
    width: 220,
    borderRadius: 12,
    textAlign: 'center',
    padding: theme.spacing(2),
    backgroundColor: '#F8F7FF',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease',
    '&:hover': { transform: 'scale(1.05)' },
    position: 'relative'
}));

function FoldersLanding ({ setSelectedFolder, setOpenFlashcardModal }) {
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedDeck, setSelectedDeck] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);

    const uniqueDecks = Object.values(
        flashcards.reduce((acc, card) => {
          if (!acc[card.deckId]) {
            acc[card.deckId] = {
                deckId: card.deckId,
                deckName: card.deckName,
                lastReviewed: card.lastReviewed || 'Never',
                cardCount: 0
            };
          }
            acc[card.deckId].cardCount += 1;
            return acc;
        }, {})
    );

    const handleMenuOpen = (event, deck) => {
        setMenuAnchor(event.currentTarget);
        setSelectedDeck(deck);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
        setSelectedDeck(null);
    };

    const handleEditFolder = () => {
        setEditModalOpen(true);
        handleMenuClose();
    };

    const handleDeleteFolder = () => {
        console.log('Deleting folder:', selectedDeck);
        handleMenuClose();
    };

    const handleSaveEdit = (updatedFolder) => {
        console.log('Updated folder:', updatedFolder);
        setEditModalOpen(false);
    };

    return (
        <div style={{padding: '10px'}}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", mb: 3 }}>
                <Button variant="contained" sx={{ backgroundColor: "#9381FF" }} onClick={() => setOpenFlashcardModal(true)}>
                    Create a Folder
                </Button>
            </Box>
            <div>
                {uniqueDecks.length > 0 ? (
                    <Grid container spacing={3}>
                        {uniqueDecks.map((deck) => (
                            <Grid size={{ xs: 6, md: 3}} key={deck.deckId}>
                                <DeckCard>
                                    <IconButton onClick={(e) => handleMenuOpen(e, deck)} sx={{position: 'absolute', top: '8px', right: '8px' }}>
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Box display="flex" justifyContent="center" alignItems="center" mt={1}>
                                        <FolderIcon sx={{ fontSize: 100, color: "#9381FF", transition: "color 0.2s ease", "&:hover": {color: "#B8B8FF"}, cursor: "pointer"  }} onClick={() => setSelectedFolder(deck)} />
                                    </Box>
                                    <Typography fontWeight="bold" mt={1}>{deck.deckName}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {deck.cardCount} cards
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Last Reviewed: {deck.lastReviewed}
                                    </Typography>
                                </DeckCard>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <FlashcardsNoFolders setOpenFlashcardModal={setOpenFlashcardModal}  />
                )}
            </div>
            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
                <MenuItem onClick={handleEditFolder}>Edit Folder</MenuItem>
                <MenuItem onClick={handleDeleteFolder}>Delete Folder</MenuItem>
            </Menu>  
            <EditFolderModal 
                open={editModalOpen} 
                onClose={() => setEditModalOpen(false)} 
                folder={selectedDeck} 
                onSave={handleSaveEdit} 
            />
        </div>
    );
}

export default FoldersLanding;
