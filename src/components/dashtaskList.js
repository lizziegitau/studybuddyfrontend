import '../App.css';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip, Card, CardContent } from '@mui/material';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PushPinIcon from '@mui/icons-material/PushPin';
import { format } from 'date-fns';

function DashTaskList({ tasks }) {

    const today = format(new Date(), 'yyyy-MM-dd');

    const todayTasks = tasks.filter(task => 
        (task.status === 'To-Do' || task.status === 'In-Progress') && task.dueDate === today
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
        <Card sx={{ padding: 2, display: 'flex', flexDirection: 'column',  borderRadius: 2, boxShadow: 3 }}>
            <CardContent sx={{ paddingBottom: "0px" }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>Today's Task List</Typography>

            {/* Task Table */}
            <TableContainer sx={{ minHeight: "auto" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Task Name</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Priority</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {todayTasks.length > 0 ? (
                            todayTasks.map((task) => (
                                <TableRow 
                                    key={task.id} 
                                    hover 
                                >
                                    <TableCell>{task.title}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {statusIcons[task.status]} 
                                            <Typography variant="body2">{task.status}</Typography>
                                        </Box>
                                    </TableCell>
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
