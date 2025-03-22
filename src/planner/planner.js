import '../App.css';
import { Typography, Button } from '@mui/material';
import SideBoard from '../components/sideBoard';
import CalendarComponent from '../components/calendar';
import AddIcon from '@mui/icons-material/Add';
import { useUser } from "@clerk/clerk-react";

function Planner () {

    const { user } = useUser()

    return (
        <div style={{minHeight: '100vh'}} className='flex bg-background'>
            <div className='flex-1 p-6'>
                <div className='flex justify-between items-center mb-4'>
                    <Typography variant='h5' className='text-primary font-semibold uppercase'>
                        {user.username}'s Planner
                    </Typography>
                    <Button variant='contained' sx={{ backgroundColor: "#9381FF" }} >
                        <AddIcon />
                        Create an Event
                    </Button>
                </div>
                <CalendarComponent/>
            </div>
            <div className="w-80 mt-10">
                <SideBoard />
            </div>
        </div>
    )
}

export default Planner

