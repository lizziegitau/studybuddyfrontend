import { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useUser, useAuth } from "@clerk/clerk-react";
import NotifsSettings from './notifsSettings';
import PasswordEditSettings from './passwordEditSettings';

const SettingsPage = () => {
  const { signOut } = useAuth();
  const { user } = useUser();
  
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.primaryEmailAddress?.emailAddress || "");

  const [notifications, setNotifications] = useState({
    dueTasks: true,
    upcomingEvents: true,
  });

  useEffect(() => {
    const savedNotifications = JSON.parse(localStorage.getItem("notifications"));
    if (savedNotifications) {
      setNotifications(savedNotifications);
    }
  }, []);

  const handleNotificationChange = (event) => {
    const updatedNotifications = {
      ...notifications,
      [event.target.name]: event.target.checked,
    };
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (setter) => (event) => setter(event.target.value);

  const handleSaveChanges = async () => {
    try {
      await user.update({ username, primaryEmailAddress: email });
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      alert("Failed to update profile.");
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFEEDD', padding: 4 }}>
      <Box sx={{ maxWidth: 600, width: '100%', backgroundColor: 'white', p: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, textTransform: 'capitalize' }}>
          {user.username}'s Settings
        </Typography>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Profile
        </Typography>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid size={{xs: 12}}>
              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={handleInputChange(setUsername)}
                variant="outlined"
                margin="normal"
                disabled={!isEditing}
              />
              <TextField
                fullWidth
                label="Email"
                value={email}
                onChange={handleInputChange(setEmail)}
                variant="outlined"
                margin="normal"
                disabled={!isEditing}
              />
              {isEditing ? (
                <PasswordEditSettings />
              ): (
              <TextField
                fullWidth
                label="Password"
                type="password"
                value="********"
                variant="outlined"
                margin="normal"
                disabled
              />
            )}
            </Grid>

            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Notifications
              </Typography>
              <NotifsSettings notifications={notifications} handleNotificationChange={handleNotificationChange} />
            </Box>

            <Grid size={{xs: 12}} sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button variant="outlined" color="error" onClick={() => signOut()}>
                Log Out
              </Button>
              {isEditing ? (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="outlined" color="secondary" onClick={handleEditToggle}>
                    Cancel
                  </Button>
                  <Button variant="contained" color="primary" onClick={handleSaveChanges}>
                    Save Changes
                  </Button>
                </Box>
              ) : (
                <Button variant="contained" color="primary" onClick={handleEditToggle}>
                  Edit Profile
                </Button>
              )}
            </Grid>
          </Grid>

      </Box>
    </Box>
  );
};

export default SettingsPage;