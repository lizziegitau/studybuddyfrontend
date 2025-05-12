import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Grid from '@mui/material/Grid2';
import FocusSession from "./focusSession";
import SessionProgress from "./sessionProgress";
import SessionTask from "./sessionTask";
import FocusTimer from "./focusTimer";
import { useUser } from "@clerk/clerk-react";
import SimpleSnackbar from "../components/snackbar";

function Timer() {
  const { user } = useUser();
  const savedSessionActive = localStorage.getItem("isFocusActive");
  const savedSessionDuration = localStorage.getItem("sessionDuration");
  const savedBreakActive = localStorage.getItem("isBreakActive");
  const [isFocusActive, setIsFocusActive] = useState(savedSessionActive === "true");
  const [isBreakActive, setIsBreakActive] = useState(savedBreakActive === "true");
  const [sessionDuration, setSessionDuration] = useState(savedSessionDuration ? parseInt(savedSessionDuration) : null);
  const [tasks, setTasks] = useState([]);
  const [sessionTasks, setSessionTasks] = useState([]);
  const [loading, setLoading] = useState(true);
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
    localStorage.setItem("isFocusActive", isFocusActive);
    localStorage.setItem("isBreakActive", isBreakActive);

    if (sessionDuration) {
      localStorage.setItem("sessionDuration", sessionDuration);
    }
  }, [isFocusActive, isBreakActive, sessionDuration]);

  useEffect(() => {
    if (sessionTasks.length > 0 && isFocusActive) {
      localStorage.setItem("currentSessionTasks", JSON.stringify(sessionTasks));
    }
  }, [sessionTasks, isFocusActive]);

  useEffect(() => {
    if (user?.id) {
        const fetchTasks = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/tasks/${user.id}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch tasks');
                }
                
                const data = await response.json();
                setTasks(data);
            } catch (err) {
                console.error('Error fetching tasks:', err);
                showSnackbar("Failed to load tasks. Please try again", "error");
            } finally {
                setLoading(false);
            }
        };
        
        fetchTasks();
    }
  }, [user]);

  useEffect(() => {
    if (isFocusActive) {
      const storedTasks = localStorage.getItem("currentSessionTasks");
      if (storedTasks) {
        try {
          const parsedTasks = JSON.parse(storedTasks);
          setSessionTasks(parsedTasks);
        } catch (err) {
          console.error("Error parsing stored session tasks:", err);
          localStorage.removeItem("currentSessionTasks");
        }
      }
    }
    else {
    const fetchSessionTasks = async () => {
      const lastSessionId = localStorage.getItem("lastSessionId");
      if (!lastSessionId) return;
  
      try {
        const res = await fetch(`/api/study-session/${lastSessionId}/tasks`);
        if (!res.ok) throw new Error("Failed to fetch session tasks");
        const data = await res.json();
        setSessionTasks(data);
      } catch (err) {
        console.error("Error fetching session tasks:", err);
        showSnackbar("Failed to load session tasks. Please try again", "error");
      }
    };
  
    fetchSessionTasks();
  }
  }, [isFocusActive]);

  const startFocusSession = (minutes) => {
    setSessionDuration(minutes);
    setIsFocusActive(true);
    setIsBreakActive(false);
  }

  const handleBreakEnd = () => {
    setIsBreakActive(false);
    localStorage.removeItem("isBreakActive");
  };
  
  const resetFocusSession = () => {
    setSessionDuration(null);
    setIsFocusActive(false);
    setIsBreakActive(false);
    localStorage.removeItem("isFocusActive");
    localStorage.removeItem("isBreakActive");
    localStorage.removeItem("sessionDuration");
    localStorage.removeItem("currentSessionTasks");
  }

  const handleAddTasks = (selectedTaskIds) => {
    const selectedTasks = tasks.filter((task) => selectedTaskIds.includes(task.taskId));
    setSessionTasks((prevTasks) => 
    {
      const newTasks = selectedTasks.filter(t => !prevTasks.some(pt => pt.taskId === t.taskId));
      showSnackbar("Tasks added to this session!", "success");
      return [...prevTasks, ...newTasks];
    });
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "#FFEEDD", p: 4}}>
      <SimpleSnackbar
          open={snackbar.open}
          onClose={hideSnackbar}
          message={snackbar.message}
          severity={snackbar.severity}
          duration={4000}
      />
      <Box sx={{ maxWidth: 900, width: "100%" }}>
        <Grid container direction="column" spacing={4}>
          <Grid size={{xs: 12}}>
            <Grid container spacing={3}>
              <Grid size={{xs: 12, md: 6}}>
                {isFocusActive ? 
                  <FocusTimer 
                    duration={sessionDuration} 
                    onReset={resetFocusSession} 
                    handleBreakEnd={handleBreakEnd}
                    taskIds={sessionTasks.map(task => task.taskId)} 
                  /> : 
                  <FocusSession onStart={startFocusSession} />
                }
              </Grid>
              <Grid size={{xs: 12, md: 6}}>
                <SessionProgress />
              </Grid>
            </Grid>
          </Grid>

          <Grid size={{xs: 12}}>
            <Box sx={{ mt: 2, p: 2, minHeight: "200px" }}>
              <SessionTask tasks={tasks} sessionTasks={sessionTasks} setSessionTasks={setSessionTasks} loading={loading} handleAddTasks={handleAddTasks} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Timer;
