import React, { useCallback, useState, useRef } from "react";
import logo from "../../assets/logo/logo-bunga-default.jpg";
import axios from "axios";
import { authSchema } from "../../helpers/ValidationSchema";
import { useNavigate } from "react-router-dom";
import { toastMessage, toastPromise } from "../../helpers/AlertMessage";
import { ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

function Auth() {
  axios.defaults.withCredentials = true;

  const [hidePassword, setHidePassword] = useState(true);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const authStatus = useRef(null);

  const navigate = useNavigate();

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      return setData((prev) => ({ ...prev, [name]: value }));
    },
    [setData]
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      authSchema
        .validate(data, { abortEarly: false })
        .then(() => {
          const authPromise = axios.post(
            "https://lulusan.ulbi.ac.id/lulusan/transkrip/sevima/login",
            data
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
              // console.log(res.data);

              authStatus.current = res.data.success;

              setData({
                email: "",
                password: "",
              });

              const expiryInDays = 18 / 24;
              Cookies.set("pbmp-login", res.data.token, {
                expires: expiryInDays,
                path: "/",
                secure: true,
                sameSite: "Strict",
              });

              const SECRET_KEY = "!uLBi123!";

              if (!SECRET_KEY) {
                console.error(
                  "Secret key is not defined. Make sure it's set in your environment variables."
                );
                return;
              }

              const getUser = res.data.data.attributes;

              const encryptedData = CryptoJS.AES.encrypt(
                JSON.stringify(getUser), // Konversi objek ke string
                SECRET_KEY
              ).toString();

              // console.log("Data Terenkripsi:", encryptedData);

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
    [authSchema, data, toastPromise, toastMessage]
  );

  return (
    <>
      <div className="auth">
        <div className="auth-title">
          <img className="logo" src={logo} alt="ULBI's Logo" />
          <div className="title">
            Selamat Datang di <span>Sistem PBMP</span>
          </div>
          <div className="univ">
            Universitas Logistik & Bisnis Internasional
          </div>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="ulbi@ulbi.ac.id"
              onChange={handleChange}
              value={data.email}
            />
            <div className="border-effect"></div>
          </div>
          <div className="auth-form-group">
            <label htmlFor="password">Password</label>
            <input
              type={hidePassword ? "password" : "text"}
              id="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={data.password}
            />
            <span
              className="material-symbols-outlined"
              onClick={() => setHidePassword(!hidePassword)}
            >
              {hidePassword ? "visibility_off" : "visibility"}
            </span>
            <div className="border-effect"></div>
          </div>
          <button
            className="auth-form-button"
            type="submit"
            disabled={data.email === "" || data.password === ""}
          >
            Login
          </button>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}

export default Auth;
