import { useState } from "react";
import { Box, Tooltip, IconButton, Typography, Card, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { motion } from "framer-motion";

const StudyMode = ({ flashcards, deckName, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const handlePrevious = () => {
    setFlipped(false);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length
    );
  };

  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Tooltip title="Back to Decks" arrow>
          <IconButton onClick={onBack} sx={{ color: "#9381FF" }}>
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Typography variant="h4" fontWeight="bold">
          Flashcards in {deckName}
        </Typography>
        <Box sx={{ width: 48 }} />
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <IconButton onClick={handlePrevious}>
          <ChevronLeftIcon />
        </IconButton>

        {/* Flashcard Container */}
        <motion.div
          className="flip-container"
          style={{
            width: "300px",
            height: "180px",
            perspective: "1000px",
          }}
        >
          <motion.div
            className="flipper"
            initial={{ rotateY: 0 }}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.6 }}
            style={{
              width: "100%",
              height: "100%",
              transformStyle: "preserve-3d",
              position: "relative",
            }}
          >
            {/* Front Side */}
            <Card
              sx={{
                width: "100%",
                height: "100%",
                p: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
                fontWeight: "medium",
                boxShadow: 3,
                borderRadius: 2,
                position: "absolute",
                backfaceVisibility: "hidden",
              }}
            >
              {flashcards[currentIndex].question}
            </Card>

            {/* Back Side */}
            <Card
              sx={{
                width: "100%",
                height: "100%",
                p: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
                fontWeight: "medium",
                boxShadow: 3,
                borderRadius: 2,
                position: "absolute",
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              {flashcards[currentIndex].answer}
            </Card>
          </motion.div>
        </motion.div>

        <IconButton onClick={handleNext}>
          <ChevronRightIcon />
        </IconButton>
      </Box>
      <Button
        variant="contained"
        sx={{ mt: 3, bgcolor: "#9381FF", "&:hover": { bgcolor: "#7a6ae1" } }}
        onClick={() => setFlipped(!flipped)}
      >
        {flipped ? "Show Question" : "Show Answer"}
      </Button>
    </Box>
  );
};

export default StudyMode;
