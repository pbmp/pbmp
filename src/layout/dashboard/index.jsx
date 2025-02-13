import Topbar from "@/layout/dashboard/Topbar/Topbar";
import Sidebar from "@/layout/dashboard/Sidebar/Sidebar";
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
