import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Grid from '@mui/material/Grid2';
import FocusSession from "./focusSession";
import UpcomingEvents from "./upcomingEvents";
import SessionProgress from "./sessionProgress";
import SessionTask from "./sessionTask";
import FocusTimer from "./focusTimer";


function Timer() {
  const savedSessionActive = localStorage.getItem("isFocusActive");
  const savedSessionDuration = localStorage.getItem("sessionDuration");
  const savedBreakActive = localStorage.getItem("isBreakActive");
  const [isFocusActive, setIsFocusActive] = useState(savedSessionActive === "true");
  const [isBreakActive, setIsBreakActive] = useState(savedBreakActive === "true");
  const [sessionDuration, setSessionDuration] = useState(savedSessionDuration ? parseInt(savedSessionDuration) : null);

  useEffect(() => {
    localStorage.setItem("isFocusActive", isFocusActive);
    localStorage.setItem("isBreakActive", isBreakActive);


    if (sessionDuration) {
      localStorage.setItem("sessionDuration", sessionDuration);
    }
  }, [isFocusActive, isBreakActive, sessionDuration]);

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
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "#FFEEDD", p: 4}}>

      {/* Left Column */}
      <Grid container spacing={6} maxWidth={900}>
        <Grid size={{ xs: 12, sm: 6}}>
        {isFocusActive ? <FocusTimer duration={sessionDuration} onReset={resetFocusSession} handleBreakEnd={handleBreakEnd} /> : <FocusSession onStart={startFocusSession} />}
          <UpcomingEvents />
        </Grid>

        {/* Right Column */}
        <Grid size={{ xs: 12, sm: 6}}>
          <SessionProgress />
          <SessionTask />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Timer;
