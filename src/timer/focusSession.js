import '../App.css';
import { useState } from 'react';
import { Box, Card, CardContent, Typography, Button, Checkbox, TextField, FormControlLabel } from "@mui/material";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { styled } from "@mui/system";

const StyledCard = styled(Card)({
    backgroundColor: "#F8F7FF",
    color: "#3E3E3E",
    borderRadius: "16px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    padding: "20px",
  });

function FocusSession ({ onStart }) {

    const [skipBreaks, setSkipBreaks] = useState(false);
    const [minutes, setMinutes] = useState(25);
  
    const handleIncrement = () => setMinutes((prev) => Math.min(prev + 10, 240)); 
    const handleDecrement = () => setMinutes((prev) => Math.max(prev - 10, 10));
  
    const breaks = Math.floor(minutes / 25);

    const handleStartSession = () => {
        onStart(minutes);
    };

    return (
        <div>
            <StyledCard>
            <CardContent>
                <Typography variant="h5" fontWeight="bold" color="#9381FF" gutterBottom>
                    Get Ready to Focus
                 </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    We'll turn off notifications and app alerts during each session.
                </Typography>
                <Box display="flex" alignItems="center" justifyContent="center">
                    <Box position="relative">
                        <TextField
                            type="text"
                            inputMode="numeric"
                            value={minutes}
                            onChange={(e) => {
                                let value = e.target.value.replace(/[^0-9]/g, "");
                        
                                if (value === "") {
                                    setMinutes("");
                                } else {
                                    let numValue = parseInt(value, 10);
                                    if (!isNaN(numValue)) {
                                        setMinutes(numValue);
                                    }
                                }
                            }}
                            onBlur={() => {
                                if (minutes === "" || minutes < 10) setMinutes(10); 
                                if (minutes > 240) setMinutes(240);
                            }}
                            sx={{ backgroundColor: '#9381FF', border: 'none', borderRadius: "8px 0 0 8px", ":hover": { bgcolor: "#B8B8FF" }, width: 80, textAlign: "center",  "& .MuiOutlinedInput-root": { height: '72px', fontSize: "24px", textAlign: "center", color: "white", "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" }, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" } }, "& .MuiOutlinedInput-notchedOutline": { border: "none" }, "& .MuiOutlinedInput-root input": { textAlign: "center" } }}
                        />
                        <Typography
                            variant="caption"
                            sx={{
                                position: "absolute",
                                bottom: 6,
                                right: 25,
                                color: "#3E3E3E",
                                fontSize: "12px",
                            }}
                        >
                            mins
                        </Typography>
                    </Box>
                    <div className="session-buttons">
                        <Button sx={{ bgcolor: "#9381FF", borderRadius: "0 8px 0 0", ":hover": { bgcolor: "#B8B8FF" } }} variant="contained" onClick={handleIncrement} disabled={minutes >= 240}>
                            <KeyboardArrowUpIcon sx={{color: 'white'}} />
                        </Button>
                        <Button sx={{ bgcolor: "#9381FF", borderRadius: "0 0 8px 0", ":hover": { bgcolor: "#B8B8FF" } }} variant="contained" onClick={handleDecrement} disabled={minutes <= 10}>
                            <KeyboardArrowDownIcon sx={{color: 'white'}} />
                        </Button>
                    </div>
                </Box>
                <Typography sx={{ mt: 1 }}>You'll have {skipBreaks ? 0 : breaks} {breaks === 1 ? "break" : "breaks"}</Typography>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                    <FormControlLabel
                        control={<Checkbox checked={skipBreaks} onChange={(e) => setSkipBreaks(e.target.checked)} />}
                        label="Skip breaks"
                    />
                <Button onClick={handleStartSession} variant="contained"  sx={{ width: '250px', mt: 2, bgcolor: "#9381FF", ":hover": { bgcolor: "#B8B8FF" } }}>
                    <PlayArrowIcon sx={{marginRight: '5px'}}/>
                    Start Focus Session
                </Button>
              </Box>
            </CardContent>
          </StyledCard>
        </div>
    )
}
export default FocusSession;