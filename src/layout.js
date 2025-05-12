import { useState } from "react";
import SideNav from "./components/sideNav";
import { Outlet } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { useTheme } from '@mui/material/styles';

function Layout  () {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const drawerWidth = 240;
  const collapsedWidth = 65;

  const desktopStyle = {
    marginLeft: `${isSidebarOpen ? drawerWidth : collapsedWidth}px`,
    width: `calc(100% - ${isSidebarOpen ? drawerWidth : collapsedWidth}px)`,
    transition: "margin-left 0.3s ease, width 0.3s ease",
  };

  const mobileStyle = {
    width: '100%'
  }

  return (
    <div className="layout-container">
      <SideNav isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} isMobile={isMobile} />
      <div style={isMobile ? mobileStyle : desktopStyle}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
