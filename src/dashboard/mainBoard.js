import '../App.css';
import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid2';
import DashTaskList from '../components/dashtaskList';
import StudyBarChart from '../components/studyBarChart';
import DashboardCard from '../components/dashboardCard';
import ProductivityWidget from '../components/productivityWidget';
import { useUser } from "@clerk/clerk-react";
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import SimpleSnackbar from '../components/snackbar';
import { useMediaQuery } from "@mui/material";
import { useTheme } from '@mui/material/styles';

dayjs.extend(isBetween);

function MainBoard() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const { user } = useUser();
  const today = dayjs();
  const sevenDaysFromToday = today.add(7, 'day');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [tasks, setTasks] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [dailyGoal, setDailyGoal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
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
    const fetchTasks = async () => {
      if (!user?.id) return;
      
      try {
        const response = await fetch(`${backendUrl}/api/tasks/${user.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        
        const data = await response.json();
        setTasks(data);
        showSnackbar("Tasks loaded successfully!", "success");

      } catch (err) {
        console.error('Error fetching tasks:', err);
        showSnackbar("Failed to load tasks.", "error");
      }
    };
    
    fetchTasks();
  }, [user?.id, backendUrl]);

  useEffect(() => {
    const fetchDailyGoal = async () => {
      if (!user?.id) return;
      
      try {
        const response = await fetch(`${backendUrl}/api/daily-goal/${user.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch daily goal');
        }
        
        const data = await response.json();
        setDailyGoal(data.dailyGoalMinutes);
        showSnackbar("Daily goal loaded!", "success");

      } catch (err) {
        console.error('Error fetching daily goal:', err);
        showSnackbar("Failed to load daily goal.", "error");
      }
    };
      
    fetchDailyGoal();
  }, [user?.id, backendUrl]);

  useEffect(() => {
    const fetchSessions = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        const res = await fetch(`${backendUrl}/api/study-session/${user.id}`);
        if (!res.ok) throw new Error("Failed to fetch study sessions");
        const data = await res.json();
        setSessions(data);
        showSnackbar("Study sessions loaded!", "success");

      } catch (error) {
        console.error("Error fetching sessions:", error);
        showSnackbar("Failed to load sessions.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [user?.id, backendUrl]);

  const upcomingTasks = tasks.filter(task => {
    const dueDate = dayjs(task.dueDate);
    return dueDate.isAfter(today) && dueDate.isBefore(sevenDaysFromToday);
  });

  const taskCounts = {
    left: upcomingTasks.filter(task => task.taskStatus === "To-Do").length,
    done: upcomingTasks.filter(task => task.taskStatus === "Done").length,
    inProgress: upcomingTasks.filter(task => task.taskStatus === "In-Progress").length
  };

  const taskCards = [
    { label: "Tasks Left", value: taskCounts.left, color: "#C6E7FF", textColor: "#133E87" },
    { label: "Done", value: taskCounts.done, color: "#A5D6A7", textColor: "#2E7D32" },
    { label: "In Progress", value: taskCounts.inProgress, color: "#FDDBBB", textColor: "#F9A825" }
  ];

  if (!user) {
    return (
      <Box p={3} sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h6">Please log in to view your dashboard</Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box p={3} sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3} sx={{height: '100vh', mb: 2}}>
      <SimpleSnackbar
        open={snackbar.open}
        onClose={hideSnackbar}
        message={snackbar.message}
        severity={snackbar.severity}
        duration={4000}
      />
      <Box display='flex' alignItems='center' justifyContent='flex-start' my={3}>
        <Typography variant='h5' fontWeight='bold' sx={{ textTransform: 'capitalize'}} >
          {user.username}'s Dashboard
        </Typography>
      </Box>
      
      <DashboardCard/>
      
      <Grid container columns={{ xs: 4, sm: 8, md: 12 }} spacing={isMobile ? 1 : 2} sx={{ my: isMobile ? 1 : 2, display: "flex", flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 1 : 2 }}>
        {taskCards.map((card, index) => (
          <Grid /* size={{ xs: 12, sm: 6, md: 4 }} */ xs={4} sm={isMobile ? 8 : 4} md={4} key={index} sx={{ flex: 1, width: "100%", minWidth: isMobile ? '100%' : 'auto' }}>
            <Box sx={{ p: isMobile ? 2 : 3, textAlign: "center", backgroundColor: card.color, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <Typography variant="h6" sx={{ color: card.textColor, fontWeight: "bold", fontSize: isMobile ? '1.25rem' : '1.5rem' }}>
                {card.value}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{fontSize: isMobile ? '0.75rem' : '0.875rem'}}>
                {card.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ width: "100%" }}>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{xs: 12, md: 6}}>
            <StudyBarChart sessions={sessions} />
          </Grid>
          <Grid size={{xs: 12, md: 6}}>
            <ProductivityWidget sessions={sessions} dailyGoal={dailyGoal} />
          </Grid>
        </Grid>
        <Grid container sx={{ mb: 3 }}>
          <Grid size={{xs: 12}}>
            <DashTaskList tasks={tasks} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default MainBoard;
