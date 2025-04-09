import { useState, useEffect } from 'react';
import '../App.css';
import { Box, Card, CardContent, Typography, CircularProgress, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { styled } from "@mui/system";
import DailyGoalModal from '../components/dailyGoalModal';
import { sessions } from '../sessionData';
import dayjs from "dayjs";

const StyledCard = styled(Card)({
    backgroundColor: "#F8F7FF",
    color: "#3E3E3E",
    borderRadius: "16px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    padding: "20px",
});

const ProgressCircle = ({ value }) => (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" value={100} size={80} thickness={4} sx={{ color: "#B8B8FF" }} />
      <CircularProgress
        variant="determinate"
        value={value}
        size={80}
        thickness={4}
        sx={{ color: "#9381FF", position: "absolute", left: 0 }}
      />
      <Box position="absolute" top="50%" left="50%" sx={{ transform: "translate(-50%, -50%)" }}>
        <Typography variant="h6" color="primary">
          {Math.round(value)}%
        </Typography>
      </Box>
    </Box>
);

function SessionProgress () {

    const [dailyGoal, setDailyGoal] = useState(30);
    const [openGoalModal, setOpenGoalModal] = useState(false)
    const [completedMinutes, setCompletedMinutes] = useState(0);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
      const today = dayjs().format("YYYY-MM-DD");
  
      const todaySessions = sessions.filter((session) => session.sessionDate === today);
      const totalMinutes = todaySessions.reduce((acc, session) => acc + session.sessionDuration, 0);
  
      setCompletedMinutes(totalMinutes);
  
      let currentStreak = 0;
      let checkDate = dayjs();
      
      while (true) {
        const dateString = checkDate.format("YYYY-MM-DD");
        const daySessions = sessions.filter((session) => session.sessionDate === dateString);
        const dayMinutes = daySessions.reduce((acc, session) => acc + session.sessionDuration, 0);
  
        if (dayMinutes >= dailyGoal) {
          currentStreak++;
          checkDate = checkDate.subtract(1, "day");
        } else {
          break;
        }
      }
  
      setStreak(currentStreak);
    }, [dailyGoal]);

    const progress = dailyGoal > 0 ? Math.min((completedMinutes / dailyGoal) * 100, 100 ): 0;

    return (
        <div>
            <StyledCard sx={{ textAlign: "center", position: "relative" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" color= "#9381FF">Daily Progress</Typography>
              <IconButton sx={{ position: "absolute", top: "10px", right: "10px" }} onClick={() => setOpenGoalModal(true)}>
                <EditIcon sx={{ color: "#9381FF" }}/>
              </IconButton>
              <ProgressCircle value={progress} />
              <Typography variant="body2" mt={1}>Daily Goal: {dailyGoal} minutes</Typography>
              <Typography variant="body2">Completed: {completedMinutes} minutes</Typography>
              <Typography variant="body2">Streak: {streak} days</Typography>
            </CardContent>
          </StyledCard>

          <DailyGoalModal dailyGoal={dailyGoal} setDailyGoal={setDailyGoal} open={openGoalModal} onClose={() => setOpenGoalModal(false)} />
        </div>
    )
}

export default SessionProgress;