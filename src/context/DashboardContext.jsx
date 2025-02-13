import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import PropTypes from "prop-types";
import Loader from "@/components/Loader/Loader";

const DashboardContext = createContext({
  user: {},
  token: null,
  expandedSidebar: true,
  handleExpandedSidebar: () => {},
});

export const DashboardProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Status autentikasi
  const navigate = useNavigate();
  const [expandedSidebar, setExpandedSidebar] = useState(true);

  const handleExpandedSidebar = () => {
    setExpandedSidebar(!expandedSidebar);
  };

  const SECRET_KEY = "!uLBi123!";

  useEffect(() => {
    const encryptedData = Cookies.get("pbmp-user");
    const getToken = Cookies.get("pbmp-login");

    if (getToken && encryptedData) {
      try {
        const decryptedData = CryptoJS.AES.decrypt(
          encryptedData,
          SECRET_KEY
        ).toString(CryptoJS.enc.Utf8);

        const parsedData = JSON.parse(decryptedData);

        setUser(parsedData);
        setToken(getToken);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to decrypt or parse user data:", error);
        navigate("/pbmp/auth", { replace: true });
      }
    } else {
      navigate("/pbmp/auth", { replace: true });
    }
  }, [navigate]);

  // Tampilkan loader hingga autentikasi selesai
  if (!isAuthenticated && !token) {
    return <Loader />;
  }

  return (
    <DashboardContext.Provider
      value={{ user, token, handleExpandedSidebar, expandedSidebar }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);

DashboardProvider.propTypes = {
  children: PropTypes.node,
};
