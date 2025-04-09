import '../App.css';
import { FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import Grid from '@mui/material/Grid2';

function NotifsSettings ({ notifications, handleNotificationChange }) {
    return (
        <Grid size={{xs: 12}}>
        <FormGroup>
          <FormControlLabel 
            control={<Checkbox checked={notifications.dueTasks} onChange={handleNotificationChange} name="dueTasks" />} 
            label="Due Tasks Notification" 
          />
          <FormControlLabel 
            control={<Checkbox checked={notifications.upcomingEvents} onChange={handleNotificationChange} name="upcomingEvents" />} 
            label="Upcoming Events Notification" 
          />
        </FormGroup>
      </Grid>
    )
}

export default NotifsSettings;