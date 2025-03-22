import '../App.css';
import { Card, CardContent, Box, Button, Typography } from '@mui/material';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';

function FlashcardsNoFolders({ setOpenFlashcardModal }) {

  return (
    <div>
      <Card
        sx={{
          p: 3,
          borderRadius: '20px',
          textAlign: 'center',
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          width: '70%',
          margin: 'auto',
          transition: '0.3s ease-in-out',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="center">
            <img
              alt="Folders Mascot"
              src="/images/folders.png"
              className="folders-image"
              style={{
                transition: 'transform 0.3s ease-in-out',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
          </Box>
          <Typography sx={{ mb: 2, p: 2, color: 'gray', fontSize: '1.1rem' }}>
            Oops! Looks like you have no folders yet 🤷. Create one to start learning.
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#9381FF',
              padding: '10px 20px',
              fontWeight: 'bold',
              borderRadius: '12px',
              textTransform: 'none',
              transition: '0.3s',
              '&:hover': {
                backgroundColor: '#7a6ce0',
                transform: 'scale(1.05)',
              },
            }}
            onClick={() => setOpenFlashcardModal(true)}
          >
            <CreateNewFolderIcon sx={{ mr: 1 }} />
            Create a New Folder
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default FlashcardsNoFolders;
