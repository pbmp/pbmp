import React, { useState } from "react";
import Topbar from "@/components/Topbar/Topbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import SmoothScroll from "@/helpers/SmoothScroll";
import { ToastContainer } from "react-toastify";

function Layout({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleShowSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <>
      <SmoothScroll />
      <ToastContainer />
      <div className="layout">
        <Topbar onHamburgerClick={toggleShowSidebar} />
        <Sidebar showSidebar={showSidebar} />
        <div className="content">{children}</div>
      </div>
    </>
  );
}

export default Layout;
