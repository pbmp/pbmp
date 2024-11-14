import React, { useEffect, useCallback } from "react";
import user from "./../../assets/images/user.png";
import { Search, Bell, EllipsisVertical, Menu } from "lucide-react";
import { useSearch } from "../../helpers/SearchContext";
import { toastMessage } from "../../helpers/AlertMessage";

function Topbar({ onHamburgerClick }) {
  const { setSearch } = useSearch();

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleInfoAlert = useCallback(() => {
    toastMessage("info", "This feature is under development!", "top-center");
  }, [toastMessage]);

  return (
    <div className="topbar">
      <div className="topbar-search">
        <button>
          <Search className="icon" strokeWidth={1.5} size={20} />
        </button>
        <input
          type="text"
          onChange={handleSearch}
          placeholder="Search Keyword..."
        />
      </div>
      <div className="topbar-other">
        <Bell
          className="notification"
          strokeWidth={1.5}
          size={20}
          onClick={handleInfoAlert}
        />
        <Menu
          className="hamburger"
          strokeWidth={1.5}
          size={20}
          onClick={onHamburgerClick}
        />
        <div className="line"></div>
        <div className="profile">
          <div className="image">
            <img src={user} alt="User" />
          </div>
          <div className="text">
            <span className="name">Muhammad Azka Nuril Islami</span>
            <span className="job">CEO</span>
          </div>
        </div>
        <span className="option" onClick={handleInfoAlert}>
          <EllipsisVertical strokeWidth={1.5} size={20} />
        </span>
      </div>
    </div>
  );
}

export default Topbar;
