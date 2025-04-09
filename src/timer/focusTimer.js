import '../App.css';
import React, { useState, useEffect } from "react";
import { CircularProgress, Button, Typography, Box, Card, CardContent } from "@mui/material";
import { styled } from "@mui/system";

const StyledCard = styled(Card)({
    backgroundColor: "#F8F7FF",
    color: "#3E3E3E",
    borderRadius: "16px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    padding: "20px",
  });


function FocusTimer ({ duration, onReset, handleBreakEnd }) {

  const breakTime = 5 * 60;

    const initialTime = duration * 60;

    const savedStartTime = localStorage.getItem("focusTimerStartTime");
    const savedRunningState = localStorage.getItem("focusTimerRunning") === "true";
    const savedBreakState = localStorage.getItem("isBreakTime") === "true";

    const calculateTimeLeft = () => {
        if (savedStartTime) {
        const elapsedTime = Math.floor((Date.now() - parseInt(savedStartTime)) / 1000);
        return Math.max((savedBreakState ? breakTime : initialTime) - elapsedTime, 0);
        }
        return savedBreakState ? breakTime : initialTime;
    };
    /* const calculateTimeLeft = () => 0; */

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);
    const [isRunning, setIsRunning] = useState(savedRunningState || true);
    const [isBreakTime, setIsBreakTime] = useState(savedBreakState || false);

    useEffect(() => {
        if (!isRunning) return;

        const timer = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev > 0) return prev - 1;

            if (!isBreakTime) {
                setIsBreakTime(true);
                localStorage.setItem("isBreakTime", true);
                return breakTime;
            } else {
                setIsBreakTime(false);
                handleBreakEnd();
                localStorage.setItem("isBreakTime", false);
                return initialTime;
            }
          }) 
        }, 1000);

        return () => clearInterval(timer);
    }, [isRunning, isBreakTime,breakTime, initialTime, handleBreakEnd]);

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
          return !prev;
        });
      };
    
      const handleReset = () => {
        setTimeLeft(initialTime);
        setIsRunning(false);
        setIsBreakTime(false);
        localStorage.removeItem("focusTimerStartTime");
        localStorage.removeItem("focusTimerRunning");
        localStorage.removeItem("isBreakTime")
        onReset();
      };
  
    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
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
    );
};

export default FocusTimer;