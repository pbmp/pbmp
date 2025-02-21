import { useCallback, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, EllipsisVertical, Menu, LogOut } from "lucide-react";
import Cookies from "js-cookie";

import userImage from "/images/user.png";
import { useSearch } from "@/context/SearchContext";
import { useDashboard } from "@/context/DashboardContext";
import { toastMessage } from "@/helpers/AlertMessage";
import useClickOutside from "../../hooks/useClickOutside";

function Topbar() {
  const [openSetting, setOpenSetting] = useState(false);
  const [openNavMobile, setOpenNavMobile] = useState(false);

  const settingRef = useRef(null);
  const navMobileRef = useRef(null);

  const { setSearch, search } = useSearch();
  const { user } = useDashboard();
  const navigate = useNavigate();

  useClickOutside(settingRef, () => setOpenSetting(false), openSetting);
  useClickOutside(navMobileRef, () => setOpenNavMobile(false), openNavMobile);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleInfoAlert = useCallback(() => {
    toastMessage("info", "This feature is under development!", "top-center");
  }, []);

  const handleLogout = useCallback(() => {
    Cookies.remove("pbmp-login");
    Cookies.remove("pbmp-user");

    navigate("/auth", {
      state: { logoutMessage: "Logout Successful!" },
    });
  }, [navigate]);

  return (
    <div className="topbar">
      <div className="topbar-search">
        <button>
          <Search className="icon" strokeWidth={1.25} size={20} />
        </button>
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search Keyword..."
        />
      </div>
      <div className="topbar-other">
        <Bell
          className="notification"
          strokeWidth={1.25}
          size={20}
          onClick={handleInfoAlert}
        />
        <Menu
          className="hamburger"
          strokeWidth={1.25}
          size={20}
          onClick={() => setOpenNavMobile(true)}
        />
        {openNavMobile ? (
          <div className="nav-mobile" ref={navMobileRef}>
            Test
          </div>
        ) : null}
        <div className="line"></div>
        <div className="profile">
          <div className="image">
            <img src={userImage} alt="User" />
          </div>
          <div className="text">
            <span className="name">{user.nama ? user.nama : user.name}</span>
            {/* <span className="job">{user?.role[0]?.nama_role}</span> */}
          </div>
        </div>
        <span className="option">
          <EllipsisVertical
            strokeWidth={1.25}
            size={20}
            onClick={() => setOpenSetting(true)}
          />
          {openSetting ? (
            <div className="option-modal" ref={settingRef}>
              <div className="option-modal-item" onClick={handleLogout}>
                <LogOut className="icon" strokeWidth={1.5} size={18} />
                <span>Logout</span>
              </div>
            </div>
          ) : null}
        </span>
      </div>
    </div>
  );
}

export default Topbar;
