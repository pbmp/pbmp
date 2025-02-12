import logo from "../../assets/logo/logo-bunga-default.jpg";
import { ToastContainer } from "react-toastify";
import { useAuth } from "./useAuth";

function Auth() {
  const { hidePassword, setHidePassword, data, handleChange, handleSubmit } =
    useAuth();

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
