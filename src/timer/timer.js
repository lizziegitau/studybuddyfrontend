import { useState } from "react";
import { Box } from "@mui/material";
import Grid from '@mui/material/Grid2';
import FocusSession from "./focusSession";
import UpcomingEvents from "./upcomingEvents";
import SessionProgress from "./sessionProgress";
import SessionTask from "./sessionTask";
import FocusTimer from "./focusTimer";


function Timer() {

  const [isFocusActive, setIsFocusActive] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(null);

  const startFocusSession = (minutes) => { 
    setSessionDuration(minutes);
    setIsFocusActive(true);
  }
  const resetFocusSession = () => {
    setSessionDuration(null);
    setIsFocusActive(false);
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "#FFEEDD", p: 4}}>

      {/* Left Column */}
      <Grid container spacing={6} maxWidth={900}>
        <Grid size={{ xs: 12, sm: 6}}>
        {isFocusActive ? <FocusTimer duration={sessionDuration} onReset={resetFocusSession} /> : <FocusSession onStart={startFocusSession} />}
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
