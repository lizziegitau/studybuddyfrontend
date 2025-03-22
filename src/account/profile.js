import React, { useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Avatar, Button, TextField, Container, Paper, Typography, Tabs, Tab, Box } from "@mui/material";
import Grid from '@mui/material/Grid2'

const Profile = () => {
  const { signOut } = useAuth();
  const { user } = useUser();
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Settings
          </Typography>
          <Tabs value={tabIndex} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            <Tab label="General Information" />
            <Tab label="Preferences" />
            <Tab label="Security" />
            <Tab label="Notifications" />
          </Tabs>
          <Box sx={{ mt: 2 }}>
            {tabIndex === 0 && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
                  <Avatar src={user?.imageUrl} sx={{ width: 100, height: 100, margin: "auto" }} />
                  <Typography variant="h6">{user?.fullName}</Typography>
                  <Button variant="contained" sx={{ mt: 1 }}>Upload New Photo</Button>
                </Grid>
                <Grid item xs={12} md={8}>
                  <TextField fullWidth label="Business Name" variant="outlined" sx={{ mb: 2 }} />
                  <TextField fullWidth label="Email Address" variant="outlined" sx={{ mb: 2 }} />
                  <TextField fullWidth label="Phone Number" variant="outlined" sx={{ mb: 2 }} />
                  <TextField fullWidth label="Country" variant="outlined" sx={{ mb: 2 }} />
                  <TextField fullWidth label="City" variant="outlined" sx={{ mb: 2 }} />
                </Grid>
              </Grid>
            )}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button variant="outlined" color="error" onClick={() => signOut()}>Log Out</Button>
            <Box>
              <Button variant="outlined" sx={{ mr: 2 }}>Cancel</Button>
              <Button variant="contained" color="primary">Save Changes</Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Profile;
