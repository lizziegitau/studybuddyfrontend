import '../App.css';
import { useState, useEffect, useCallback } from "react";
import { CircularProgress, Button, Typography, Box, Card, CardContent } from "@mui/material";
import { styled } from "@mui/system";
import { useUser } from "@clerk/clerk-react";
import SimpleSnackbar from '../components/snackbar';

const StyledCard = styled(Card)({
    backgroundColor: "#F8F7FF",
    color: "#3E3E3E",
    borderRadius: "16px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    padding: "20px",
  });

function FocusTimer ({ duration, onReset, handleBreakEnd, taskIds }) {
    const { user } = useUser();
    const breakTime = 5 * 60;
    const initialTime = duration * 60;
    const savedStartTime = localStorage.getItem("focusTimerStartTime");
    const savedRunningState = localStorage.getItem("focusTimerRunning") === "true";
    const savedBreakState = localStorage.getItem("isBreakTime") === "true";

    const [accumulatedTime, setAccumulatedTime] = useState(
      parseInt(localStorage.getItem("accumulatedFocusTime") || "0")
    );
    const [sessionStartedAt] = useState(
      localStorage.getItem("sessionStartedAt") || new Date().toISOString()
    );

    const calculateTimeLeft = () => {
        if (savedStartTime) {
        const elapsedTime = Math.floor((Date.now() - parseInt(savedStartTime)) / 1000);
        return Math.max((savedBreakState ? breakTime : initialTime) - elapsedTime, 0);
        }
        return savedBreakState ? breakTime : initialTime;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);
    const [isRunning, setIsRunning] = useState(savedRunningState || false); // FIXED: Start paused by default
    const [isBreakTime, setIsBreakTime] = useState(savedBreakState || false);
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

    const saveSessionData = useCallback(async (totalMinutes) => {
      
      try {
        if (totalMinutes <= 0) return;
  
        const payload = {
          userId: user.id,
          sessionDate: sessionStartedAt.split('T')[0],
          sessionDuration: totalMinutes,
          sessionTaskIds: taskIds || []
        };
  
        const response = await fetch('/api/study-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
  
        if (!response.ok) {
          throw new Error('Failed to create session');
        }
  
        const savedSession = await response.json();
        localStorage.setItem("lastSessionId", savedSession.sessionId);

        showSnackbar(`Session saved: ${totalMinutes} minutes!`, "success");
  
      } catch (error) {
        console.error('Error saving session:', error);
        showSnackbar("Failed to save session!", "error");
      }
    }, [user.id, sessionStartedAt, taskIds]);

    useEffect(() => {
        if (!isRunning) return;

        if (!localStorage.getItem("sessionStartedAt")) {
          localStorage.setItem("sessionStartedAt", new Date().toISOString());
        }

        const timer = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev > 0) {
              if (!isBreakTime) {
                setAccumulatedTime(acc => {
                  const newAcc = acc + 1;
                  localStorage.setItem("accumulatedFocusTime", newAcc.toString());
                  return newAcc;
                });
              }
              return prev - 1;
            }

            if (!isBreakTime) {
                setIsBreakTime(true);
                localStorage.setItem("isBreakTime", true);
                showSnackbar("Break time started! Relax for 5 mins.", "info");
                return breakTime;
            } else {
                setIsBreakTime(false);
                handleBreakEnd();
                localStorage.setItem("isBreakTime", false);
                showSnackbar("Focus session resumed. Let's go!", "success");
                return initialTime;
            }
          }) 
        }, 1000);

        return () => clearInterval(timer);
    }, [isRunning, isBreakTime,breakTime, initialTime, handleBreakEnd]);

    // No automatic saving - only save on reset or session end
  
    useEffect(() => {
      const handleBeforeUnload = () => {
        const totalMinutes = Math.floor(accumulatedTime / 60);
        if (totalMinutes > 0 && !isBreakTime) {
          const payload = {
            userId: user.id,
            sessionDate: sessionStartedAt.split('T')[0],
            sessionDuration: totalMinutes,
            sessionTaskIds: taskIds || []
          };
  
          if (navigator.sendBeacon) {
            navigator.sendBeacon('/api/study-session', JSON.stringify(payload));
          } else {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/study-session', false);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(payload));
          }
        }
      };
  
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [accumulatedTime, isBreakTime, user.id, sessionStartedAt, taskIds]);

    useEffect(() => {
        if (!savedStartTime) {
          localStorage.setItem("focusTimerStartTime", Date.now());
        }
      }, [savedStartTime]);
  
    const handleStartPause = () => {
        if (!isRunning) {
          localStorage.setItem("focusTimerStartTime", Date.now());
        } else {
          localStorage.removeItem("focusTimerStartTime");
        }
    
        setIsRunning((prev) => {
          localStorage.setItem("focusTimerRunning", !prev);
          showSnackbar(!prev ? "Timer started!" : "Timer paused.", "info");
          return !prev;
        });
      };
    
      const handleReset = async () => {
        const totalMinutes = Math.floor(accumulatedTime / 60);
        if (totalMinutes > 0 && !isBreakTime) {
          await saveSessionData(totalMinutes);
        }
      
        setTimeLeft(initialTime);
        setIsRunning(false);
        setIsBreakTime(false);
        setAccumulatedTime(0);
        localStorage.removeItem("focusTimerStartTime");
        localStorage.removeItem("focusTimerRunning");
        localStorage.removeItem("isBreakTime");
        localStorage.removeItem("accumulatedFocusTime");
        localStorage.removeItem("sessionStartedAt");
        onReset();

        showSnackbar("Timer reset successfully!", "success");
      };
      
  
    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
      <div>
        <SimpleSnackbar
            open={snackbar.open}
            onClose={hideSnackbar}
            message={snackbar.message}
            severity={snackbar.severity}
            duration={4000}
        />
        <StyledCard>
            <CardContent>
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Typography variant='h5' color='#9381FF'>{isBreakTime ? "Break Time" : "Focus Session"}</Typography>
                <Box position="relative" display="inline-flex">
                    <Box sx={{ transform: "scaleX(-1)" }}>
                        <CircularProgress
                            sx={{ color: isBreakTime ? "#9381FF" : "#B8B8FF" }}
                            variant="determinate"
                            value={(timeLeft / (isBreakTime ? breakTime : initialTime)) * 100}
                            size={120}
                            thickness={4}
                        />
                    </Box>
                    <Box
                        top={0}
                        left={0}
                        bottom={0}
                        right={0}
                        position="absolute"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Typography variant="h4">{formatTime(timeLeft)}</Typography>
                    </Box>
                </Box>
                <Typography>Up Next: {!isBreakTime ? "5 min Break" : "25 min Session"}</Typography>
                <Box display="flex" gap={2}>
                    <Button variant="contained" sx={{ bgcolor: "#9381FF", ":hover": { bgcolor: "#B8B8FF" } }} onClick={handleStartPause}>
                        {isRunning ? "Pause" : "Start"}
                    </Button>
                    <Button variant="contained" sx={{ bgcolor: "#9381FF", ":hover": { bgcolor: "#B8B8FF" } }} onClick={handleReset}>
                        Reset
                    </Button>
                </Box>
            </Box>
            </CardContent>
          </StyledCard>
      </div>
    );
};

export default FocusTimer;
