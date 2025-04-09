import { useState } from "react";
import { Box, Typography } from "@mui/material";
//import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FlashcardGrid from '../components/flashcardsGrid';
import FoldersLanding from "../components/foldersLanding";
import FlashcardFolderModal from "../components/createFolderModal.js";
import CreateFlashcardModal from "../components/createFlashcardModal";
import WelcomeCard from "../components/welcomeCard";
import { useUser } from "@clerk/clerk-react";

/* const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
}); */

const Flashcards = () => {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [openFlashcardModal, setOpenFlashcardModal] = useState(false);
  const [openCreateFlashcardModal, setOpenCreateFlashcardModal] = useState(false);
  const { user } = useUser()

  return (
    <div className="flashcard-container">
        <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: '#FFEEDD' }}>
          <Box display='flex' alignItems='center' justifyContent='flex-start' mb={3}>
            <Typography variant='h5' fontWeight='bold' sx={{ textTransform: 'capitalize'}} >{user.username}'s Flashcards</Typography>
          </Box>

          <WelcomeCard/>

            {selectedFolder ? (
                <FlashcardGrid folder={selectedFolder} onBack={() => setSelectedFolder(null)} setOpenCreateFlashcardModal={setOpenCreateFlashcardModal} />
            ) : (
                <FoldersLanding setSelectedFolder={setSelectedFolder} setOpenFlashcardModal={setOpenFlashcardModal}/>
            )}
            <FlashcardFolderModal open={openFlashcardModal} onClose={() => setOpenFlashcardModal(false)} />
            <CreateFlashcardModal open={openCreateFlashcardModal} onClose={() => setOpenCreateFlashcardModal(false)} />

        </Box>
    </div>
  );
};

export default Flashcards;