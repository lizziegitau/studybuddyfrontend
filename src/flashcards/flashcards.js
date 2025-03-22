import { useState } from "react";
import { Box } from "@mui/material";
//import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FlashcardGrid from '../components/flashcardsGrid';
import FoldersLanding from "../components/foldersLanding";
import FlashcardFolderModal from "../components/createFlashcardFolder";
import WelcomeCard from "../components/welcomeCard";

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

  return (
    <div className="flashcard-container">
        <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: '#FFEEDD' }}>

          <WelcomeCard/>

            {selectedFolder ? (
                <FlashcardGrid folder={selectedFolder} onBack={() => setSelectedFolder(null)} />
            ) : (
                <FoldersLanding setSelectedFolder={setSelectedFolder} setOpenFlashcardModal={setOpenFlashcardModal}/>
            )}
            <FlashcardFolderModal open={openFlashcardModal} onClose={() => setOpenFlashcardModal(false)} />
        </Box>
    </div>
  );
};

export default Flashcards;