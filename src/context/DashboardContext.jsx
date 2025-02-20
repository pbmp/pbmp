import { createContext, useContext, useState, useEffect } from "react";
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

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleExpandedSidebar = () => {
    setExpandedSidebar(!expandedSidebar);
  };

  const SECRET_KEY = "#uLBi2025#";

  useEffect(() => {
    const paramsObject = Object.fromEntries(searchParams.entries());
    const encryptedData = Cookies.get("pbmp-user");
    const getToken = Cookies.get("pbmp-login");
    const hasParams = Object.keys(paramsObject).length !== 0;

    const processUserAuthentication = (token, user) => {
      try {
        const expiryInDays = 18 / 24;

        Cookies.set("pbmp-login", token, {
          expires: expiryInDays,
          path: "/",
          secure: true,
          sameSite: "Strict",
        });

        if (!SECRET_KEY) {
          console.error("Secret key is not defined.");
          return;
        }

        const encryptedUserData = CryptoJS.AES.encrypt(
          JSON.stringify(user),
          SECRET_KEY
        ).toString();

        Cookies.set("pbmp-user", encryptedUserData, {
          expires: expiryInDays,
          path: "/",
          secure: true,
          sameSite: "Strict",
        });

        setUser(user);
        setToken(token);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error processing user authentication:", error);
      }
    };

    const decryptUserData = () => {
      if (!getToken || !encryptedData) {
        navigate("/pbmp/auth", { replace: true });
        return;
      }

      try {
        const decryptedData = CryptoJS.AES.decrypt(
          encryptedData,
          SECRET_KEY
        ).toString(CryptoJS.enc.Utf8);

        if (!decryptedData) throw new Error("Decryption failed");

        const parsedData = JSON.parse(decryptedData);
        setUser(parsedData);
        setToken(getToken);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to decrypt or parse user data:", error);
        navigate("/pbmp/auth", { replace: true });
      }
    };

    if (hasParams) {
      const codeParams = paramsObject.code;

      apiOptions
        .get("/google/login/callback", { params: { code: codeParams } })
        .then((res) => {
          toastMessage("success", res.data.message);
          processUserAuthentication(res.data.token, res.data.user);
        })
        .catch((err) => {
          console.error("Error fetching Google login callback:", err);
        })
        .finally(() => {
          // Membersihkan query params di URL
          const params = new URLSearchParams(window.location.search);
          ["authuser", "code", "prompt", "state", "scope"].forEach((param) =>
            params.delete(param)
          );
          window.history.replaceState(
            {},
            "",
            `${window.location.pathname}?${params.toString()}`
          );
        });
    } else {
      decryptUserData();
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
