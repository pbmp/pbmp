import { useEffect, useRef } from "react";
import { Users, PanelLeftClose, FileText } from "lucide-react";
import logo from "/logo/logo-Photoroom.png";
import { NavLink, useLocation } from "react-router-dom";
import { useDashboard } from "../../context/DashboardContext";

const navigation = [
  {
    id: 1,
    icon: <FileText className="icon" strokeWidth={1.25} />,
    text: "PBM",
    url: "/",
  },
  {
    id: 2,
    icon: <Users className="icon" strokeWidth={1.25} />,
    text: "Perwalian",
    url: "/perwalian",
  },
];

function Sidebar() {
  const location = useLocation();
  const messageRef = useRef(null);
  const logoRef = useRef(null);
  const textRefs = useRef([]);

  const { expandedSidebar, handleExpandedSidebar } = useDashboard();

  const getActiveClass = (path) => {
    return location.pathname === path
      ? "menu-list-item active"
      : "menu-list-item";
  };

  useEffect(() => {
    if (!expandedSidebar) {
      messageRef.current.style.display = "none";
      logoRef.current.style.display = "none";
      textRefs.current.forEach((text) => {
        text.style.display = "none";
      });
    }

    const timeOut = setTimeout(() => {
      if (expandedSidebar) {
        messageRef.current.style.display = "block";
        logoRef.current.style.display = "block";
        textRefs.current.forEach((text) => {
          text.style.display = "flex";
        });
      }
    }, 500);

    return () => clearTimeout(timeOut);
  }, [expandedSidebar, messageRef, logoRef]);

  return (
    <div className={`sidebar ${expandedSidebar ? "" : "collapse"} `}>
      <div className="sidebar-logo">
        <img src={logo} alt="Logo" ref={logoRef} />
        <span onClick={handleExpandedSidebar}>
          <PanelLeftClose size={24} strokeWidth={1.25} />
        </span>
      </div>
      <div className="sidebar-menus">
        <div className="menu-title">Main Menu</div>
        <div className="menu-list">
          {navigation.map((item, index) => {
            return (
              <NavLink
                key={index}
                className={() => getActiveClass(item.url)}
                to={item.url}
              >
                <span className="icon">{item.icon}</span>
                <span
                  className="text"
                  ref={(el) => (textRefs.current[index] = el)}
                >
                  {item.text}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
      <div className="sidebar-message" ref={messageRef}>
        <div className="text">
        Sinkronisasi data dilakukan setiap pukul 03.00 WIB, apabila ada
        perubahan data setelah jadwal sinkronisasi, silahkan hubungi no staff DTI di bawah ini.
        Terima kasih.
        </div>
        <div className="name">Ahmad Rifky Ayala</div>
        <div className="no-hp">(+62) 82118952582</div>
      </div>
    </div>
  );
}

export default Sidebar;
