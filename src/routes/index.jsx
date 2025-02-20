import { Outlet } from "react-router-dom";
import { SearchProvider } from "../context/SearchContext";
import { DashboardProvider } from "@/context/DashboardContext";
import DashboardLayout from "../layout";
import Auth from "../pages/Auth";
import Error404 from "../pages/Error404/Error404";
import PBM from "../pages/PBM";
import Perwalian from "../pages/Perwalian/Perwalian";

export function routes() {
  return [
    {
      path: "/pbmp/auth",
      element: <Auth />,
    },
    {
      path: "*",
      element: <Error404 />,
    },
    {
      path: "/pbmp",
      element: (
        <SearchProvider>
          <DashboardProvider>
            <DashboardLayout>
              <Outlet />
            </DashboardLayout>
          </DashboardProvider>
        </SearchProvider>
      ),
      children: [
        {
          index: true,
          element: <PBM />,
        },
        {
          path: "perwalian",
          element: <Perwalian />,
        },
      ],
    },
  ];
}
