import React, { useState } from "react";
import { Users, PanelLeftClose, FileText, DatabaseBackup } from "lucide-react";
import logo from "@/assets/logo/logo-Photoroom.png";
import { NavLink, useLocation } from "react-router-dom";

function Sidebar({ showSidebar }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const ExpandedSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const location = useLocation();

  const getActiveClass = (path) => {
    // Pastikan hanya path spesifik yang mendapatkan kelas active
    return location.pathname === path
      ? "menu-list-item active"
      : "menu-list-item";
  };

  return (
    <div
      className={`sidebar ${showSidebar ? "show" : ""} ${
        isExpanded ? "" : "collapse"
      } `}
    >
      <div className="sidebar-logo">
        <img src={logo} alt="Logo" />
        <span onClick={ExpandedSidebar}>
          <PanelLeftClose size={24} strokeWidth={1.25} />
        </span>
      </div>
      <div className="sidebar-menus">
        <div className="menu-title">Main Menu</div>
        <div className="menu-list">
          <NavLink className={() => getActiveClass("/pbmp/synchgrate")} to={"/pbmp/synchgrate"}>
            <span className="icon">
              <DatabaseBackup size={22} strokeWidth={1.25} />
            </span>
            <span className="text">Synch Grate</span>
          </NavLink>
          <NavLink className={() => getActiveClass("/pbmp/")} to={"/pbmp/"}>
            <span className="icon">
              <FileText size={22} strokeWidth={1.25} />
            </span>
            <span className="text">PBM</span>
          </NavLink>
          <NavLink className={() => getActiveClass("/pbmp/perwalian")} to={"/pbmp/perwalian"}>
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
