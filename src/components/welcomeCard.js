import { Card, Typography, Box } from "@mui/material";
import { useUser } from "@clerk/clerk-react";

const WelcomeCard = () => {

    const { user } = useUser()

  return (
    <Card 
      sx={{
        borderRadius: "16px",
        background: "linear-gradient(135deg, #9381FF, #B8B8FF)",
        color: "white",
        p: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mt: '10px',
        mb: '50px'
      }}
    >
      <Box>
        <Typography variant="h4" fontWeight="bold">
          Hi, {user.username}! 👋
        </Typography>
        <Typography variant="h6">
          Ready to start learning with flashcards?
        </Typography>
      </Box>
      <Box sx={{ width: '150px', height: '150px', borderRadius: "50%" }}>
        <img src="/images/flashcards.jpeg" alt="Study Illustration"/>
      </Box>
    </Card>
  );
};

export default WelcomeCard;
