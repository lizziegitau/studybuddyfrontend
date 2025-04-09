import '../App.css'
import { useState } from 'react'
import BoardView from './boardView'
import { Fab, Box, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import CreateTaskModal from '../components/createTaskModal';
import TaskModal from '../components/taskModal';
import { tasks } from '../taskData';
import { useUser } from "@clerk/clerk-react";

function Tasks () {
    const { user } = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [createTaskModal, setCreateTaskModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const handleModalToggle = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
    };

    const handleCreateTaskClose = () => {
        setCreateTaskModal(false)
    };

    return (
        <div style={{backgroundColor: '#FFEEDD', paddingTop: '20px' }}>
            <div className="p-4">
                <Box display='flex' alignItems='center' justifyContent='flex-start' mb={3} pl={2}>
                    <Typography variant='h5' fontWeight='bold' sx={{ textTransform: 'capitalize'}} >{user.username}'s Flashcards</Typography>
                </Box>
                <BoardView tasks={tasks} handleModalToggle={handleModalToggle} setCreateTaskModal={setCreateTaskModal} />
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
                onSave={(updatedTask) => {
                    // Update the tasks array with the new task data
                    console.log('Updated Task:', updatedTask);
                }}
            />
            <CreateTaskModal 
                open={createTaskModal} 
                onClose={handleCreateTaskClose} 
                task={selectedTask} 
            />

        </div>
    )
}

export default Tasks