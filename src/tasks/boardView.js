import '../App.css';
import { Box, Card, CardContent,CardActionArea, Typography} from '@mui/material';
import Grid from '@mui/material/Grid2';
import AddIcon from '@mui/icons-material/Add';

function BoardView({handleModalToggle, tasks, setCreateTaskModal}) {
    const taskColumns = [
        { status: 'To-Do', color: '#C6E7FF', border: '#133E87', tasks: tasks.filter(task => task.status === 'To-Do') },
        { status: 'In-Progress', color: '#FDDBBB', border: '#F96E2A', tasks: tasks.filter(task => task.status === 'In-Progress') },
        { status: 'Done', color: '#B8B8FF', border: '#493D9E', tasks: tasks.filter(task => task.status === 'Done') }
    ];

    const priorityColors = {
        High: '#FFBCBC',
        Medium: '#FDDBBB',
        Low: '#C7FFD8'
    };

    return (
        <div className='task-board-container'>
            <Box sx={{ flexGrow: 1, padding: 2 }}>
                <Grid container spacing={2} justifyContent="space-evenly">
                    {taskColumns.map((column) => (
                        <Grid className='task-column' key={column.status} size={{xs:12, sm:4}} sx={{width: '300px', borderRadius: '12px', backgroundColor: column.color, padding: '10px', minHeight: '500px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'}}>
                            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center',}}>
                                <Typography variant='h5' sx={{ paddingX: 3, fontWeight: 'bold', color: column.border }}>
                                    {column.status}   
                                </Typography>
                                <Typography variant='body2' sx={{ backgroundColor: 'white', padding: '2px 8px', borderRadius: '50%', fontWeight: 'bold' }}>
                                    {column.tasks.length}
                                </Typography>
                            </Box>
                            {column.tasks.map((task) => (
                                <Box key={task.id} sx={{ margin: 2, backgroundColor: 'white', boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}> 
                                    <Card onClick={() => handleModalToggle(task)}>
                                        <CardActionArea>
                                            <CardContent>
                                                <Typography sx={{ fontWeight: 'bold', fontSize: '18px', padding: '5px' }}>
                                                    {task.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {task.dueDate}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 1 }}>
                                                    <Typography variant='body2' sx={{ backgroundColor: priorityColors[task.priority], color: 'black', padding: '3px 8px', borderRadius: '8px', fontWeight: 'bold' }}>
                                                        {task.priority}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Box>
                                ))}
                                <Card sx={{border: '2px', borderStyle: 'solid', borderColor: column.border, cursor: 'pointer'}} onClick={() => setCreateTaskModal(true)}>
                                    <Typography variant='h8'>
                                        <AddIcon sx={{margin: '5px'}} />
                                        Add New Task
                                    </Typography>
                                </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </div>
    );
}

export default BoardView;
