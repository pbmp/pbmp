import { useCallback, useState, useRef, useEffect } from "react";
import axios from "axios";
import { authSchema } from "@/validations/Auth";
import { useNavigate, useLocation } from "react-router-dom";
import { toastMessage, toastPromise } from "@/helpers/AlertMessage";
import { ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

export function useAuth() {
  axios.defaults.withCredentials = true;

  const [hidePassword, setHidePassword] = useState(true);
  const [data, setData] = useState({
    identifier: "", // Bisa berisi email atau NIDN
    password: "",
  });

  const authStatus = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      authSchema
        .validate(data, { abortEarly: false })
        .then(() => {
          // Tentukan apakah identifier adalah email atau nidn
          const isEmail = emailRegex.test(data.identifier);
          const requestBody = isEmail
            ? { email: data.identifier, password: data.password }
            : { nidn: data.identifier, password: data.password };

          const authPromise = axios.post(
            "https://lulusan.ulbi.ac.id/lulusan/transkrip/sevima/login",
            requestBody
          );

          toastPromise(
            authPromise,
            {
              pending: "Login in progress. Please wait..",
            },
            { autoClose: 2000 },
            () => {
              if (authStatus.current) {
                navigate("/pbmp/");
              }
            }
          );

          authPromise
            .then((res) => {
              authStatus.current = res.data.success;

              setData({
                identifier: "",
                password: "",
              });

              const expiryInDays = 18 / 24;
              Cookies.set("pbmp-login", res.data.token, {
                expires: expiryInDays,
                path: "/",
                secure: true,
                sameSite: "Strict",
              });

              const SECRET_KEY = "#uLBi2025#";

              if (!SECRET_KEY) {
                console.error("Secret key is not defined.");
                return;
              }

              const getUser = res.data.data.attributes;
              const encryptedData = CryptoJS.AES.encrypt(
                JSON.stringify(getUser),
                SECRET_KEY
              ).toString();

              Cookies.set("pbmp-user", encryptedData, {
                path: "/",
                secure: true,
                sameSite: "Strict",
              });
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((errors) => {
          errors.inner.forEach((error) => {
            toastMessage("error", error.message, {
              position: "top-center",
            });
          });
        });
    },
    [data, navigate]
  );

  useEffect(() => {
    if (location.state?.hasNoAccess) {
      toastMessage("warn", location.state.hasNoAccess, {
        position: "top-center",
      });
      navigate(location.pathname, {
        state: { ...location.state, hasNoAccess: undefined },
        replace: true,
      });
    } else if (location.state?.logoutMessage) {
      toastMessage("success", location.state.logoutMessage);
      navigate(location.pathname, {
        state: { ...location.state, logoutMessage: undefined },
        replace: true,
      });
    }
  }, [location.state, navigate, location.pathname]);

  return {
    hidePassword,
    setHidePassword,
    data,
    authStatus,
    handleChange,
    handleSubmit,
    ToastContainer,
  };
}
