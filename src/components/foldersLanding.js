import '../App.css';
import { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Card, Menu, MenuItem, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import FolderIcon from '@mui/icons-material/Folder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FlashcardsNoFolders from './flashcardsNoFolders';
import EditFolderModal from './editFolderModal';
import SimpleSnackbar from './snackbar';

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

function FoldersLanding ({ setSelectedFolder, setOpenFlashcardModal, folders, onFolderDelete }) {
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedDeck, setSelectedDeck] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [localFolders, setLocalFolders] = useState(folders || []);
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
        setLocalFolders(folders || []);
    }, [folders]);

    const uniqueDecks = localFolders.map(deck => ({
        deckId: deck.deckId,
        deckName: deck.deckName,
        cardCount: deck.flashcardCount || 0
    }));

    const handleMenuOpen = (event, deck) => {
        event.stopPropagation();
        setMenuAnchor(event.currentTarget);
        setSelectedDeck(deck);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
    };

    const handleEditFolder = () => {
        setEditModalOpen(true);
        handleMenuClose();
    };

    const handleDeleteFolder = async () => {
        if (!selectedDeck || !selectedDeck.deckId) {
            showSnackbar("Cannot delete folder: Invalid folder ID.", "error");
            handleMenuClose();
            return;
        }
        try {
            const response = await fetch(`api/decks/${selectedDeck.deckId}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete folder');
            }
            setLocalFolders(prev => prev.filter(deck => deck.deckId !== selectedDeck.deckId));

            if (onFolderDelete) {
                onFolderDelete(selectedDeck.deckId);
            }
            showSnackbar("Folder deleted successfully.", "success");

        } catch (error) {
            console.error('Error deleting folder:', error);
            showSnackbar("Error deleting folder.", "error");
        }
        handleMenuClose();
    };

    const handleSaveEdit = async (updatedFolder) => {
        if (!updatedFolder || !updatedFolder.deckId) {
            showSnackbar("Cannot update folder: Invalid folder ID.", "error");
            return;
        }
        try {
            const response = await fetch(`api/decks/${updatedFolder.deckId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ deckName: updatedFolder.deckName }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to update folder');
            }

            setLocalFolders(prev => 
                prev.map(deck => 
                    deck.deckId === updatedFolder.deckId 
                        ? { ...deck, deckName: updatedFolder.deckName } 
                        : deck
                )
            );

            showSnackbar("Folder updated successfully.", "success");
            
        } catch (error) {
            showSnackbar("Error updating folder.", "error");
            console.error('Error updating folder:', error);
        }
        setEditModalOpen(false);
    };

    return (
        <div style={{padding: '10px'}}>
            <SimpleSnackbar
                open={snackbar.open}
                onClose={hideSnackbar}
                message={snackbar.message}
                severity={snackbar.severity}
                duration={4000}
            />
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
