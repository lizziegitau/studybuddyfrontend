import { useState, useEffect } from 'react';
import '../App.css';
import { Box, Card, CardContent, Typography, CircularProgress, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { styled } from "@mui/system";
import DailyGoalModal from '../components/dailyGoalModal';
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { useUser } from "@clerk/clerk-react";
import SimpleSnackbar from '../components/snackbar';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

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

function SessionProgress() {
    const { user } = useUser();
    const [dailyGoal, setDailyGoal] = useState(30);
    const [openGoalModal, setOpenGoalModal] = useState(false);
    const [completedMinutes, setCompletedMinutes] = useState(0);
    const [streak, setStreak] = useState(0);
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
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
        const fetchDailyGoal = async () => {
            if (!user?.id) return;
            
            try {
                const response = await fetch(`/api/daily-goal/${user.id}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch daily goal');
                }
                
                const data = await response.json();
                setDailyGoal(data.dailyGoalMinutes);
            } catch (err) {
                console.error('Error fetching daily goal:', err);
                showSnackbar("Failed to load daily goal", "error");
            }
        };
        
        fetchDailyGoal();
    }, [user?.id]);

    useEffect(() => {
        const fetchSessions = async () => {
            if (!user?.id) return;
            
            setIsLoading(true);
            try {
                const res = await fetch(`/api/study-session/${user.id}`);
                if (!res.ok) throw new Error("Failed to fetch study sessions");
                const data = await res.json();
                setSessions(data);
            } catch (error) {
                console.error("Error fetching sessions:", error);
                showSnackbar("Failed to load session data", "error");
                setError('Failed to load session data');
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchSessions();
    }, [user?.id]);

    useEffect(() => {
      if (sessions.length === 0 || dailyGoal <= 0) return;
      
      const today = dayjs().startOf('day');

      const todaySessions = sessions.filter((session) => {
          const sessionDay = dayjs(session.sessionDate).startOf('day');
          return sessionDay.isSame(today);
      });
      const totalMinutes = todaySessions.reduce((acc, session) => acc + session.sessionDuration, 0);

      setCompletedMinutes(totalMinutes);

      let currentStreak = 0;
      let checkDate = dayjs();
      
      while (true) {
          const checkDateStart = checkDate.startOf('day');
          const daySessions = sessions.filter((session) => {
              const sessionDay = dayjs(session.sessionDate).startOf('day');
              return sessionDay.isSame(checkDateStart);
          });
          
          const dayMinutes = daySessions.reduce((acc, session) => acc + session.sessionDuration, 0);
  
          if (dayMinutes >= dailyGoal) {
              currentStreak++;
              checkDate = checkDate.subtract(1, "day");
          } else {
              break;
          }
      }
  
      setStreak(currentStreak);
  }, [sessions, dailyGoal]);

    const progress = dailyGoal > 0 ? Math.min((completedMinutes / dailyGoal) * 100, 100) : 0;

    const handleGoalUpdate = (newGoal) => {
        setDailyGoal(newGoal);
    };

    if (!user) {
        return <StyledCard><CardContent><Typography>Please log in to view your progress</Typography></CardContent></StyledCard>;
    }

    if (isLoading) {
        return (
            <StyledCard sx={{ textAlign: "center", minHeight: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CircularProgress />
            </StyledCard>
        );
    }

    if (error) {
        return (
            <StyledCard sx={{ textAlign: "center" }}>
                <CardContent>
                    <Typography color="error">{error}</Typography>
                    <Typography variant="body2">Please try again later</Typography>
                </CardContent>
            </StyledCard>
        );
    }

    return (
        <div>
            <SimpleSnackbar
                open={snackbar.open}
                onClose={hideSnackbar}
                message={snackbar.message}
                severity={snackbar.severity}
                duration={4000}
            />
            <StyledCard sx={{ textAlign: "center", position: "relative" }}>
                <CardContent>
                <Typography variant="h6" fontWeight="bold" color="#9381FF">Daily Progress</Typography>
                <IconButton 
                    sx={{ position: "absolute", top: "10px", right: "10px" }} 
                    onClick={() => setOpenGoalModal(true)}
                >
                    <EditIcon sx={{ color: "#9381FF" }}/>
                </IconButton>
                <ProgressCircle value={progress} />
                <Typography variant="body2" mt={1}>Daily Goal: {dailyGoal} minutes</Typography>
                <Typography variant="body2">Completed: {completedMinutes} minutes</Typography>
                <Typography variant="body2">Streak: {streak} days</Typography>
                </CardContent>
            </StyledCard>
            <DailyGoalModal 
                dailyGoal={dailyGoal} 
                setDailyGoal={handleGoalUpdate} 
                open={openGoalModal} 
                onClose={() => setOpenGoalModal(false)} 
                userId={user.id} 
            />
        </div>
    );
}

export default SessionProgress;
