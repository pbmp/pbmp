import Topbar from "@/layout/Topbar/Topbar";
import Sidebar from "@/layout/Sidebar/Sidebar";
import { ToastContainer } from "react-toastify";
import PropTypes from "prop-types";

function DashboardLayout({ children }) {
  return (
    <>
      <ToastContainer />
      <div className="layout">
        <Topbar />
        <Sidebar />
        <div className="content">{children}</div>
      </div>
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};

export default DashboardLayout;
