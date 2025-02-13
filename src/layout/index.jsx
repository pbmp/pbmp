import Topbar from "@/layout/Topbar/Topbar";
import Sidebar from "@/layout/Sidebar/Sidebar";
import { ToastContainer } from "react-toastify";

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

export default DashboardLayout;
