import React, { useEffect, useState } from "react";
import { Users, PanelLeftClose, FileText } from "lucide-react";
import logo from "/logo/logo-Photoroom.png";
import { NavLink, useLocation } from "react-router-dom";
import { useDashboard } from "../../context/DashboardContext";

function Sidebar() {
  const location = useLocation();
  const [isAdmak, setIsAdmak] = useState(false);

  const { expandedSidebar, handleExpandedSidebar, user } = useDashboard();

  const getActiveClass = (path) => {
    // Pastikan hanya path spesifik yang mendapatkan kelas active
    return location.pathname === path
      ? "menu-list-item active"
      : "menu-list-item";
  };

  useEffect(() => {
    const getIsAdmak = user?.role.find((item) => item.id_role === "admak");

    setIsAdmak(!!getIsAdmak);
  }, [user]);

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
          {/* {isAdmak ? (
            <NavLink
              className={() => getActiveClass("/pbmp/synchronize")}
              to={"/pbmp/synchronize"}
            >
              <span className="icon">
                <DatabaseBackup size={22} strokeWidth={1.25} />
              </span>
              <span className="text">Synchronize</span>
            </NavLink>
          ) : null} */}
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
