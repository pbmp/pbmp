import { useEffect, useCallback, useState, useRef } from "react";
import userImage from "/images/user.png";
import { Search, Bell, EllipsisVertical, Menu } from "lucide-react";
import { useSearch } from "@/context/SearchContext";
import { toastMessage } from "@/helpers/AlertMessage";
import { useDashboard } from "@/context/DashboardContext";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function Topbar() {
  const [openModal, setOpenModal] = useState(false);

  const modalRef = useRef(null);

  const { setSearch, search } = useSearch();
  const { user } = useDashboard();
  const navigate = useNavigate();

  useEffect(() => {
    const clickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setOpenModal(false);
      }
    };

    if (openModal) {
      document.addEventListener("mousedown", clickOutside);
    } else {
      document.removeEventListener("mousedown", clickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", clickOutside);
    };
  }, [modalRef, openModal]);

  // useEffect(() => {
  //   console.log(openModal);
  // }, []);

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
        <Menu className="hamburger" strokeWidth={1.25} size={20} />
        <div className="line"></div>
        <div className="profile">
          <div className="image">
            <img src={userImage} alt="User" />
          </div>
          <div className="text">
            <span className="name">{user.nama}</span>
            <span className="job">{user.role[0]?.nama_role}</span>
          </div>
        </div>
        <span className="option">
          <EllipsisVertical
            strokeWidth={1.25}
            size={20}
            onClick={() => setOpenModal(true)}
          />
          {openModal ? (
            <div className="option-modal" ref={modalRef}>
              <span onClick={handleLogout}>Logout</span>
            </div>
          ) : null}
        </span>
      </div>
    </div>
  );
}

export default Topbar;
