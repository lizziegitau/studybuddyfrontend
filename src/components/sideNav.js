import '../App.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import { 
  List, 
  IconButton, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Menu, 
  MenuItem, 
  Box, 
  Tooltip,
  AppBar,
  Toolbar,
  useMediaQuery,
  SwipeableDrawer
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TaskIcon from '@mui/icons-material/Task';
import StyleIcon from '@mui/icons-material/Style';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TimerIcon from '@mui/icons-material/Timer';
import SettingsIcon from '@mui/icons-material/Settings';
import { CssBaseline } from '@mui/material';
import { useAuth } from '@clerk/clerk-react';

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

const MobileAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#9381ff',
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Tasks', icon: <TaskIcon />, path: '/tasks' },
  { text: 'Flashcards', icon: <StyleIcon />, path: '/flashcards' },
  { text: 'Planner', icon: <CalendarMonthIcon />, path: '/planner' },
  { text: 'Study Timer', icon: <TimerIcon />, path: '/timer' }
];

function SideNav({ isSidebarOpen, setIsSidebarOpen }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const settingsOpen = Boolean(anchorEl);

  // Close mobile drawer when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setMobileOpen(false);
    }
  }, [isMobile]);

  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigateToSettings = () => {
    navigate('/settings');
    handleMenuClose();
    if (isMobile) setMobileOpen(false);
  };

  const handleLogout = () => {
    signOut();
    handleMenuClose();
    if (isMobile) setMobileOpen(false);
  };
  
  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const drawerContent = (
    <>
      <img 
        alt='StudyBuddy Logo' 
        src={isMobile || isSidebarOpen ? "/images/studybuddylargelogo.png" : "/images/studybuddysmalllogo.png"} 
        style={{ 
          width: isMobile || isSidebarOpen ? '220px' : '30px', 
          transition: 'width 0.3s', 
          margin: '20px' 
        }} 
      />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block', marginTop: '2px', padding: '2px' }}>
            <ListItemButton 
              onClick={() => handleNavigation(item.path)}
              sx={{ justifyContent: (isMobile || isSidebarOpen) ? 'initial' : 'center', px: 2.5 }}
            >
              <ListItemIcon sx={{ justifyContent: 'center', mr: (isMobile || isSidebarOpen) ? 3 : 'auto', color: 'black' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ opacity: (isMobile || isSidebarOpen) ? 1 : 0, color: 'black' }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <ListItem disablePadding sx={{ display: 'block', marginTop: '2px', padding: '2px' }}>
        <ListItemButton
          onClick={handleSettingsClick}
          sx={{ justifyContent: (isMobile || isSidebarOpen) ? 'initial' : 'center', px: 2.5 }}
        >
          <ListItemIcon sx={{ justifyContent: 'center', mr: (isMobile || isSidebarOpen) ? 3 : 'auto', color: 'black' }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" sx={{ opacity: (isMobile || isSidebarOpen) ? 1 : 0, color: 'black' }} />
        </ListItemButton>
      </ListItem>
      <Menu
        anchorEl={anchorEl}
        open={settingsOpen}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <MenuItem onClick={handleNavigateToSettings}>Manage Account</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
      {!isMobile && (
        <Box sx={{ mt: 'auto', p: 2 }}>
          <Tooltip title={isSidebarOpen ? '' : ''} placement="right">
            <IconButton 
              onClick={handleDrawerToggle} 
              sx={{ width: '100%', display: 'flex', justifyContent: 'center', borderRadius: '0px', color: 'black'}}
            >
              {isSidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              <ListItemText 
                primary={isSidebarOpen ? 'Collapse Bar' : ''} 
                sx={{ opacity: isSidebarOpen ? 1 : 0, ml: 1, color: '#343131' }}
              />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Mobile App Bar with hamburger menu */}
      <MobileAppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
            <img 
              alt='StudyBuddy Logo' 
              src="/images/studybuddysmalllogo.png" 
              style={{ height: '40px' }} 
            />
          </Box>
        </Toolbar>
      </MobileAppBar>
      
      {/* Mobile Drawer - Temporary, slides in from left */}
      {isMobile ? (
        <SwipeableDrawer
          variant="temporary"
          open={mobileOpen}
          onOpen={() => setMobileOpen(true)}
          onClose={() => setMobileOpen(false)}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: '#9381ff',
            },
          }}
        >
          {drawerContent}
        </SwipeableDrawer>
      ) : (
        // Desktop Drawer - Permanent, can be expanded/collapsed
        <Drawer 
          variant="permanent" 
          open={isSidebarOpen}
          sx={{
            display: { xs: 'none', md: 'block' },
            width: isSidebarOpen ? drawerWidth : collapsedWidth,
            flexShrink: 0,
            transition: "width 0.3s ease",
            "& .MuiDrawer-paper": {
              width: isSidebarOpen ? drawerWidth : collapsedWidth,
              transition: "width 0.3s ease",
              position: "fixed",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
      
      {/* Add top margin to content on mobile to account for AppBar */}
      {/* <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          mt: isMobile ? 8 : 0 
        }}
      > */}
        {/* Your main content goes here */}
      {/* </Box> */}
    </Box>
  );
}

export default SideNav;