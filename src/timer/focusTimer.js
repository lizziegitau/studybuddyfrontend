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


function FocusTimer ({ duration, onReset }) {

    const initialTime = duration * 60;
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(true);
  
    useEffect(() => {
        setTimeLeft(duration * 60);
    }, [duration]);

    useEffect(() => {
        if (!isRunning) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [isRunning]);
  
    const handleStartPause = () => {
      setIsRunning(!isRunning);
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
                <Box position="relative" display="inline-flex">
                    <Box sx={{ transform: "scaleX(-1)" }}>
                        <CircularProgress
                            sx={{ color: '#B8B8FF'}}
                            variant="determinate"
                            value={(timeLeft / initialTime) * 100}
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
                <Box display="flex" gap={2}>
                    <Button variant="contained" sx={{ bgcolor: "#9381FF", ":hover": { bgcolor: "#B8B8FF" } }} onClick={handleStartPause}>
                        {isRunning ? "Pause" : "Start"}
                    </Button>
                    <Button variant="contained" sx={{ bgcolor: "#9381FF", ":hover": { bgcolor: "#B8B8FF" } }} onClick={onReset}>
                        Reset
                    </Button>
                </Box>
            </Box>
            </CardContent>
            </StyledCard>
    );
};

export default FocusTimer;