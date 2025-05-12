import { Card, Typography, Box } from "@mui/material";
import { useUser } from "@clerk/clerk-react";

const studyTips = [
  "Break big tasks into small steps — small wins keep you moving!",
  "Review your flashcards just before bed — it boosts retention!",
  "Try a 25-minute focus sprint — distractions can wait.",
  "Don't wait for motivation — start, and motivation will follow.",
  "Consistency beats intensity. Study a little every day.",
  "Use your calendar — what gets scheduled gets done.",
  "Reflect on what you finished today — progress matters.",
  "Take 5-minute breaks — your brain needs to recharge.",
  "Celebrate small wins — progress fuels motivation.",
  "Keep your phone out of sight during study sessions."
];

const DashboardCard = () => {
    const { user } = useUser();
    const randomText = studyTips[Math.floor(Math.random() * studyTips.length)];

  return (
    <Card 
      sx={{
        borderRadius: "16px",
        backgroundColor: "#B8B8FF",
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
          Hi, {user?.username || "User"}! 👋
        </Typography>
        <Typography variant="h6" sx={{ color: 'white' }}>
            {randomText}
        </Typography>
      </Box>
      <Box sx={{ width: '150px', height: '150px', borderRadius: "50%" }}>
        <img src="/images/dashboard.png" alt="Study Illustration"/>
      </Box>
    </Card>
  );
};

export default DashboardCard;
