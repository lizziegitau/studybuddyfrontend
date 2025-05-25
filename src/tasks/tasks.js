import { useState, useEffect } from 'react';
import BoardView from './boardView';
import { Fab, Box, Typography, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CreateTaskModal from '../components/createTaskModal';
import TaskModal from '../components/taskModal';
import { useUser } from "@clerk/clerk-react";
import SimpleSnackbar from '../components/snackbar';

function Tasks() {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const { user } = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [createTaskModal, setCreateTaskModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    const showSnackbar = (message, severity = 'error') => {
    setSnackbar({
        open: true,
        message,
        severity,
    });
    };

    const hideSnackbar = () => {
    setSnackbar(prev => ({
        ...prev,
        open: false,
    }));
    };

    useEffect(() => {
        if (user?.id) {
            const fetchTasks = async () => {
                try {
                    setLoading(true);
                    const response = await fetch(`${backendUrl}/api/tasks/${user.id}`);
                    
                    if (!response.ok) {
                        throw new Error('Failed to fetch tasks');
                    }
                    
                    const data = await response.json();
                    setTasks(data);
                    showSnackbar("Tasks loaded successfully!", "success");
                } catch (err) {
                    console.error('Error fetching tasks:', err);
                    showSnackbar("Failed to load tasks. Please try again later.", "error");
                } finally {
                    setLoading(false);
                }
            };
            
            fetchTasks();
        }
    }, [user, backendUrl]);

    const handleModalToggle = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
        if (isEditing) {
            setIsEditing(false);
        }
    };

    const handleCreateTaskClose = () => {
        setCreateTaskModal(false);
    };

    const handleTaskSave = (newTask) => {
        setTasks(prevTasks => [newTask, ...prevTasks]);
    };

    const handleUpdateTask = async (updatedTask) => {
        try {
            const response = await fetch(`${backendUrl}/api/tasks/${updatedTask.taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    taskDescription: updatedTask.taskDescription,
                    dueDate: updatedTask.dueDate,
                    taskStatus: updatedTask.taskStatus,
                    priority: updatedTask.priority
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update task');
            }

            const data = await response.json();

            setTasks(prevTasks => 
                prevTasks.map(task => 
                    task.taskId === data.taskId ? data : task
                )
            );
            
            return data;
        } catch (err) {
            console.error('Error updating task:', err);
            showSnackbar("Error updating task", "error");
            throw err;
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            const response = await fetch(`${backendUrl}/api/tasks/${taskId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete task');
            }

            setTasks(prevTasks => prevTasks.filter(task => task.taskId !== taskId));
            showSnackbar("Task deleted successfully!", "success");
            
            return await response.json();
        } catch (err) {
            console.error('Error deleting task:', err);
            showSnackbar("Error deleting task", "error");
            throw err;
        }
    };

    return (
        <div style={{backgroundColor: '#FFEEDD', paddingTop: '20px', minHeight: '100vh' }}>
            <SimpleSnackbar
                open={snackbar.open}
                onClose={hideSnackbar}
                message={snackbar.message}
                severity={snackbar.severity}
                duration={4000}
            />
            <div className="p-4">
                <Box display='flex' alignItems='center' justifyContent='flex-start' my={5} pl={2}>
                    <Typography variant='h5' fontWeight='bold' sx={{ textTransform: 'capitalize'}} >
                        {user?.username || 'Your'}'s Tasks
                    </Typography>
                </Box>
                
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                        <CircularProgress />
                    </Box>
                ) : (
                    <BoardView 
                        tasks={tasks} 
                        handleModalToggle={handleModalToggle} 
                        setCreateTaskModal={setCreateTaskModal}
                        onDeleteTask={handleDeleteTask}
                        setIsEditing={setIsEditing}
                    />
                )}
                
                <Fab
                    aria-label="add"
                    onClick={() => setCreateTaskModal(true)}
                    style={{
                        backgroundColor: "#9381FF",
                        color: "white",
                        position: "fixed",
                        bottom: "20px",
                        right: "40px",
                        zIndex: 1000
                    }}
                >
                    <AddIcon />
                </Fab>
            </div>
            <TaskModal 
                open={isModalOpen} 
                onClose={handleClose} 
                task={selectedTask} 
                setIsEditing={setIsEditing}
                onSave={handleUpdateTask}
            />
            <CreateTaskModal 
                open={createTaskModal} 
                onClose={handleCreateTaskClose}
                onSave={handleTaskSave}
            />
        </div>
    )
}

export default Tasks;