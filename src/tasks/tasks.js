import '../App.css'
import { useState } from 'react'
import BoardView from './boardView'
import { Fab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import TaskModal from '../components/taskModal';
import { tasks } from '../taskData'

function Tasks () {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedTask, setSelectedTask] = useState(null);

    const handleModalToggle = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
    };

    return (
        <div style={{backgroundColor: '#FFEEDD', paddingTop: '20px' }}>
            <div className="p-4">
                <BoardView tasks={tasks} handleModalToggle={handleModalToggle} />
                <Fab
                    aria-label="add"
                    //onClick={() => setCreateTaskModal(true)}
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
            />
        </div>
    )
}

export default Tasks