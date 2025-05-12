import { CircularProgress, Box, Typography } from "@mui/material";
import { styled } from '@mui/system';
import StyleIcon from '@mui/icons-material/Style';

const IconContainer = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
});

const FlashcardLoading = () => {
  return (
    <Box sx={{
      width: 400,
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 4,
      borderRadius: '10px',
      textAlign: 'center',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }}>
      <Box position="relative" width={80} height={80} margin="auto">
        <CircularProgress
          size={80}
          thickness={4}
          sx={{ color: '#B8B8FF' }}
        />
        <IconContainer>
          <StyleIcon fontSize="large" sx={{ color: '#6C63FF' }} />
        </IconContainer>
      </Box>
      <Typography variant="h6" mt={3} fontWeight={500}>
        Preparing your flashcards
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Generating content based on your notes...
      </Typography>
    </Box>
  );
};

export default FlashcardLoading;
