import '../App.css';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TaskIcon from '@mui/icons-material/Task';
import StyleIcon from '@mui/icons-material/Style';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TimerIcon from '@mui/icons-material/Timer';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { CssBaseline } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

const drawerWidth = 240;
const collapsedWidth = 65;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: '#9381ff',
  flexShrink: '0'
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  backgroundColor: '#9381ff',
  flexShrink: '0'
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open ? openedMixin(theme) : closedMixin(theme)),
    '& .MuiDrawer-paper': open ? openedMixin(theme) : closedMixin(theme),
  })
);

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Tasks', icon: <TaskIcon />, path: '/tasks' },
  { text: 'Flashcards', icon: <StyleIcon />, path: '/flashcards' },
  { text: 'Planner', icon: <CalendarMonthIcon />, path: '/planner' },
  { text: 'Study Timer', icon: <TimerIcon />, path: '/timer' },
  { text: 'Account', icon: <AccountCircleIcon />, path: '/account' }
];

function SideNav ({ isSidebarOpen, setIsSidebarOpen }) {
  
    const handleDrawerToggle = () => {
      setIsSidebarOpen(!isSidebarOpen)
    };

    return (
    <Box sx={{ display: 'flex' }}>
        <CssBaseline/>
      <Drawer variant="permanent" open={isSidebarOpen} sx={{
        width: isSidebarOpen ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        transition: "width 0.3s ease",
        "& .MuiDrawer-paper": {
            width: isSidebarOpen ? drawerWidth : collapsedWidth,
            transition: "width 0.3s ease",
            position: "fixed",
        },
    }}>
        <img alt='StudyBuddy Logo' src= {isSidebarOpen ? "/images/studybuddylargelogo.png" : "/images/studybuddysmalllogo.png"} style={{ width: isSidebarOpen ? '220px' : '30px', transition: 'width 0.3s', margin: '20px' }} />
        <List>
        {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: 'block', marginTop: '2px', padding: '2px' }}>
              <ListItemButton href={item.path} sx={{ justifyContent: isSidebarOpen ? 'initial' : 'center', px: 2.5 }} >
                <ListItemIcon sx={{ justifyContent: 'center', mr: isSidebarOpen ? 3 : 'auto', color: 'black' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ opacity: isSidebarOpen ? 1 : 0, color: 'black' }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box sx={{ mt: 'auto', p: 2 }}>
            <Tooltip title={isSidebarOpen ? '' : ''} placement="right" >
                <IconButton onClick={handleDrawerToggle} sx={{ width: '100%', display: 'flex', justifyContent: 'center', borderRadius: '0px', color: 'black'}}>
                {isSidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                <ListItemText primary= {isSidebarOpen ? 'Collapse Bar' : ''} sx={{ opacity: isSidebarOpen ? 1 : 0, ml: 1, color: '#343131' }}/>
                </IconButton>
            </Tooltip>
        </Box>
      </Drawer>
    </Box>
    )
}

export default SideNav