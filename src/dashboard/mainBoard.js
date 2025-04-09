import '../App.css';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2'
import { tasks } from '../taskData';
import DashTaskList from '../components/dashtaskList';
import StudyBarChart from '../components/studyBarChart';
import DashboardCard from '../components/dashboardCard';
import { useUser } from "@clerk/clerk-react";

function MainBoard() {
  const { user } = useUser();
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(task => task.dueDate === today);

  const taskCounts = {
    left: todayTasks.filter(task => task.status === "To-Do").length,
    done: todayTasks.filter(task => task.status === "Done").length,
    inProgress: todayTasks.filter(task => task.status === "In-Progress").length
  };

  const taskCards = [
    { label: "Tasks Left", value: taskCounts.left, color: "#C6E7FF", textColor: "#133E87" },
    { label: "Done", value: taskCounts.done, color: "#A5D6A7", textColor: "#2E7D32" },
    { label: "In Progress", value: taskCounts.inProgress, color: "#FDDBBB", textColor: "#F9A825" }
  ]

  return (
    <Box p={3}>
      <Box display='flex' alignItems='center' justifyContent='flex-start' mb={3}>
        <Typography variant='h5' fontWeight='bold' sx={{ textTransform: 'capitalize'}} >{user.username}'s Dashboard</Typography>
      </Box>
      <DashboardCard/>
      
      <Grid container spacing={2} sx={{ my: 2, }}>
        {taskCards.map((card, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <Box sx={{ p: 3, textAlign: "center", backgroundColor: card.color }}>
              <Typography variant="h6" sx={{ color: card.textColor, fontWeight: "bold" }}>
                {card.value}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {card.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2} sx={{ mt: 2, }}>
        <Grid size={{xs: 12, md: 6}}>
          <Box sx={{ p: 2, minHeight: 300, height: "100%", display: "flex", flexDirection: "column" }}>
            <StudyBarChart />
          </Box>
        </Grid>

        <Grid size={{xs: 12, md: 6}}>
          <Box sx={{ p: 2, minHeight: 300, height: "100%", display: "flex", flexDirection: "column" }}>
            <DashTaskList tasks={tasks} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default MainBoard;
