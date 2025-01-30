import React, { useState } from "react";
import { Users, PanelLeftClose, FileText, DatabaseBackup } from "lucide-react";
import logo from "@/assets/logo/logo-Photoroom.png";
import { NavLink, useLocation } from "react-router-dom";
import { useDashboard } from "../../context/DashboardContext";

function Sidebar() {
  const location = useLocation();

  const { expandedSidebar, handleExpandedSidebar } = useDashboard();

  const getActiveClass = (path) => {
    // Pastikan hanya path spesifik yang mendapatkan kelas active
    return location.pathname === path
      ? "menu-list-item active"
      : "menu-list-item";
  };

  return (
    <div className={`sidebar  ${expandedSidebar ? "" : "collapse"} `}>
      <div className="sidebar-logo">
        <img src={logo} alt="Logo" />
        <span onClick={handleExpandedSidebar}>
          <PanelLeftClose size={24} strokeWidth={1.25} />
        </span>
      </div>
      <div className="sidebar-menus">
        <div className="menu-title">Main Menu</div>
        <div className="menu-list">
          <NavLink
            className={() => getActiveClass("/pbmp/synchronize")}
            to={"/pbmp/synchronize"}
          >
            <span className="icon">
              <DatabaseBackup size={22} strokeWidth={1.25} />
            </span>
            <span className="text">Synchronize</span>
          </NavLink>
          <NavLink className={() => getActiveClass("/pbmp/")} to={"/pbmp/"}>
            <span className="icon">
              <FileText size={22} strokeWidth={1.25} />
            </span>
            <span className="text">PBM</span>
          </NavLink>
          <NavLink
            className={() => getActiveClass("/pbmp/perwalian")}
            to={"/pbmp/perwalian"}
          >
            <span className="icon">
              <Users size={22} strokeWidth={1.25} />
            </span>
            <span className="text">Perwalian</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
