import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UsersManagement from "@/pages/Users/Users";
import Error404 from "@/pages/Error404/Error404";
import Perwalian from "@/pages/Perwalian/Perwalian";
import PBM from "@/pages/PBM/PBM";
import SynchGrate from "@/pages/SynchGrate/SynchGrate";
import { SearchProvider } from "@/helpers/SearchContext";
import "@/main.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <SearchProvider>
        <Routes>
          <Route path="/users" element={<UsersManagement />} />
          <Route path="/perwalian" element={<Perwalian />} />
          <Route path="/pbmp" element={<PBM />} />
          <Route path="/synchgrate" element={<SynchGrate />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </SearchProvider>
    </BrowserRouter>
  </StrictMode>
);

// testing
