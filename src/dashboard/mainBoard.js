import React, { useState } from "react";
import { Container, Card, CardContent, Typography, CircularProgress, List, ListItem, ListItemText, Avatar, Box } from "@mui/material";
import Grid from '@mui/material/Grid2'
import { blue, green, purple, red } from "@mui/material/colors";

const MainBoard = () => {
  const [taskStats, setTaskStats] = useState({
    total: 240,
    inProgress: 64,
    pending: 20,
    completed: 156,
  });

  const [sprintProgress, setSprintProgress] = useState({
    completed: 75,
    development: 80,
    deployment: 60,
    uiDesign: 90,
  });

  const [toDoList, setToDoList] = useState([
    { text: "Define user personas", status: "Approved" },
    { text: "Create wireframes", status: "In Progress" },
    { text: "Research audience", status: "Pending" },
    { text: "Refine user flow", status: "Approved" },
  ]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {/* Task Stats */}
        {Object.entries(taskStats).map(([key, value], index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ bgcolor: index % 2 === 0 ? blue[50] : purple[50] }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  {key.replace(/([A-Z])/g, " $1").toUpperCase()}
                </Typography>
                <Typography variant="h4">{value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Sprint Progress */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Sprint Progress</Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <CircularProgress variant="determinate" value={sprintProgress.completed} color="primary" size={60} />
                <Typography variant="h6">{sprintProgress.completed}% Completed</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* To-Do List */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Today's To-Do List</Typography>
              <List>
                {toDoList.map((task, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={task.text} secondary={task.status} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MainBoard;