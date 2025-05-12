import '../App.css';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip, Card, CardContent } from '@mui/material';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PushPinIcon from '@mui/icons-material/PushPin';
import { addDays, isWithinInterval } from 'date-fns';

function DashTaskList({ tasks }) {

    const today = new Date();
    const sevenDaysFromToday = addDays(today, 7);

    const upcomingTasks = tasks.filter(task => 
        (task.taskStatus === 'To-Do' || task.taskStatus === 'In-Progress') && isWithinInterval(new Date(task.dueDate), { start: today, end: sevenDaysFromToday })
    );

    const statusIcons = {
        'To-Do': <PushPinIcon sx={{ color: '#B0BEC5' }} />,
        'In-Progress': <HourglassEmptyIcon sx={{ color: '#FFD54F' }} />,
    };

    const priorityColors = {
        High: { color: '#E57373', label: 'High' },
        Medium: { color: '#FFB74D', label: 'Medium' },
        Low: { color: '#FFD54F', label: 'Low' },
    };

    return (
        <Card sx={{ marginBottom: 2, padding: 2, display: 'flex', flexDirection: 'column',  borderRadius: 2, boxShadow: 3 }}>
            <CardContent sx={{ paddingBottom: "0px" }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>Today's Task List</Typography>

            <TableContainer sx={{ minHeight: "auto" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Task Name</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Due Date</TableCell>
                            <TableCell>Priority</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {upcomingTasks.length > 0 ? (
                            upcomingTasks.map((task) => (
                                <TableRow 
                                    key={task.taskId} 
                                    hover 
                                >
                                    <TableCell>{task.taskDescription}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {statusIcons[task.taskStatus]} 
                                            <Typography variant="body2">{task.taskStatus}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={priorityColors[task.priority].label} 
                                            sx={{
                                                backgroundColor: priorityColors[task.priority].color,
                                                color: '#FFF',
                                                fontWeight: 'bold',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                padding: '4px 8px',
                                            }} 
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    <Typography variant="body2" color="textSecondary" sx={{ margin: 0, padding: 0 }}>
                                        No tasks for today.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            </CardContent>
        </Card>
    );
}

export default DashTaskList;
