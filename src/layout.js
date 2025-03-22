import { useState } from "react";
import SideNav from "./components/sideNav";
import { Outlet } from "react-router-dom";

function Layout  () {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const drawerWidth = 240;
  const collapsedWidth = 65;

  return (
    <div className="layout-container">
      <SideNav isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div style={{ marginLeft: `${isSidebarOpen ? drawerWidth : collapsedWidth}px`, width: `calc(100% - ${isSidebarOpen ? drawerWidth : collapsedWidth}px)`, transition: "margin-left 0.3s ease, width 0.3s ease" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
