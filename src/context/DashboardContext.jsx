import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import PropTypes from "prop-types";
import Loader from "@/components/Loader/Loader";
import { apiOptions } from "../hooks/useApiSevima";
import { toastMessage } from "../helpers/AlertMessage";

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
  const [expandedSidebar, setExpandedSidebar] = useState(true);

  const statusLoginGoogle = useRef(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleExpandedSidebar = () => {
    setExpandedSidebar(!expandedSidebar);
  };

  const SECRET_KEY = "#uLBi2025#";

  useEffect(() => {
    const paramsObject = Object.fromEntries(searchParams.entries());

    if (Object.keys(paramsObject).length !== 0) {
      // console.log("searchParams:", paramsObject);
      const codeParams = paramsObject.code;

      apiOptions
        .get("/google/login/callback", {
          params: { code: codeParams },
        })
        .then((res) => {
          toastMessage("success", res.data.message);

          const expiryInDays = 18 / 24;

          Cookies.set("pbmp-login", res.data.token, {
            expires: expiryInDays,
            path: "/",
            secure: true,
            sameSite: "Strict",
          });

          if (!SECRET_KEY) {
            console.error("Secret key is not defined.");
            return;
          }

          const getUser = res.data.user;
          const encryptedData = CryptoJS.AES.encrypt(
            JSON.stringify(getUser),
            SECRET_KEY
          ).toString();

          Cookies.set("pbmp-user", encryptedData, {
            expires: expiryInDays,
            path: "/",
            secure: true,
            sameSite: "Strict",
          });
        })
        .catch((err) => {
          console.error(err);
        });

      const params = new URLSearchParams(window.location.search);
      const paramsToDelete = ["authuser", "code", "prompt", "state", "scope"];
      paramsToDelete.forEach((param) => params.delete(param));

      // Update URL tanpa reload
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, "", newUrl);
    } else {
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
    }
  }, [navigate, searchParams]);

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
