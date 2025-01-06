import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import UsersManagement from "@/pages/Users/Users";
import Error404 from "@/pages/Error404/Error404";
import Perwalian from "@/pages/Perwalian/Perwalian";
import PBM from "@/pages/PBM/PBM";
import SynchGrate from "@/pages/SynchGrate/SynchGrate";
import Loader from "@/components/Loader/Loader";
import Auth from "@/pages/Auth/Auth";
import { SearchProvider } from "@/helpers/SearchContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardProvider } from "./context/DashboardContext";

function App() {
  const queryClient = new QueryClient();

  const DashboardComponents = () => {
    return (
      <DashboardProvider>
        <Outlet />
      </DashboardProvider>
    );
  };

  return (
    <BrowserRouter>
      <SearchProvider>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/pbmp/auth" element={<Auth />} />
            <Route path="/pbmp/" element={<DashboardComponents />}>
              <Route path="users" element={<UsersManagement />} />
              <Route path="perwalian" element={<Perwalian />} />
              <Route index element={<PBM />} />
              <Route path="synchgrate" element={<SynchGrate />} />
            </Route>
            <Route path="*" element={<Error404 />} />
            <Route path="/loader" element={<Loader />} />
          </Routes>
        </QueryClientProvider>
      </SearchProvider>
    </BrowserRouter>
  );
}

export default App;
