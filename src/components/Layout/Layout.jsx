import React, { useState } from "react";
import Topbar from "@/components/Topbar/Topbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import { ToastContainer } from "react-toastify";

function Layout({ children }) {
  return (
    <>
      {/* <SmoothScroll /> */}
      <ToastContainer />
      <div className="layout">
        <Topbar />
        <Sidebar />
        <div className="content">{children}</div>
      </div>
    </>
  );
}

export default Layout;
