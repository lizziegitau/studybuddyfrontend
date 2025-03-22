import '../App.css';
import { useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, Typography, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PushPinIcon from '@mui/icons-material/PushPin';

function TableView({handleModalToggle, tasks}) {
    const [sortBy, setSortBy] = useState('dueDate');
    const [orderAsc, setOrderAsc] = useState(true);

    const handleSort = (column) => {
        if (sortBy === column) {
            setOrderAsc(!orderAsc);
        } else {
            setSortBy(column);
            setOrderAsc(true);
        }
    };

    const sortedTasks = [...tasks].sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return orderAsc ? -1 : 1;
        if (a[sortBy] > b[sortBy]) return orderAsc ? 1 : -1;
        return 0;
    });

    const statusIcons = {
        'To-Do': <PushPinIcon sx={{ color: '#B0BEC5' }} />,
        'In-Progress': <HourglassEmptyIcon sx={{ color: '#FFD54F' }} />,
        'Done': <CheckCircleIcon sx={{ color: '#81C784' }} />,
    };

    const priorityColors = {
        High: { color: '#E57373', label: 'High' },
        Medium: { color: '#FFB74D', label: 'Medium' },
        Low: { color: '#FFD54F', label: 'Low' },
    };

    return (
        <div className='task-list-container'>
            <Box sx={{ flexGrow: 1, padding: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <TableContainer component={Paper} className='table-wrapper'>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Task Name
                                </TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortBy === 'status'}
                                        direction={orderAsc ? 'asc' : 'desc'}
                                        onClick={() => handleSort('status')}
                                    >
                                        Status
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortBy === 'dueDate'}
                                        direction={orderAsc ? 'asc' : 'desc'}
                                        onClick={() => handleSort('dueDate')}
                                    >
                                        Due Date
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortBy === 'priority'}
                                        direction={orderAsc ? 'asc' : 'desc'}
                                        onClick={() => handleSort('priority')}
                                    >
                                        Priority
                                    </TableSortLabel>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedTasks.map((task) => (
                                <TableRow key={task.id} hover onClick={() => handleModalToggle(task)}>
                                    <TableCell>{task.title}</TableCell>
                                    <TableCell>{task.description}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {statusIcons[task.status]} <Typography variant="body2">{task.status}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{task.dueDate}</TableCell>
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
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </div>
    );
}

export default TableView;
