import React, { useRef } from "react";
import Layout from "../../components/Layout/Layout";
import {
  FileText,
  Printer,
  CloudDownload,
  LibraryBig,
  Blocks,
  CalendarFold,
} from "lucide-react";
// import { useReactToPrint } from "react-to-print";
import Document from "../../pages/PBM/Document/Document";
import { NavLink } from "react-router-dom";

function PBMLink({ children }) {
  const printRef = useRef(null);

  const content = "semester genap tahun akademik 2023/2024";

  return (
    <>
      <Layout>
        <div className="pbm">
          <div className="pbm-header">
            <div className="menu">
              <div className="icon">
                <FileText strokeWidth={1.25} size={28} />
              </div>
              <div className="title">PBM</div>
              <div className="desc">Laporan Kinerja Dosen</div>
            </div>
            <div className="action">
              <div className="download">
                <CloudDownload className="icon" strokeWidth={2} />
                <div className="text">Download</div>
              </div>
              <div
                className="print"
                onClick={useReactToPrint({ contentRef: printRef })}
              >
                <Printer className="icon" strokeWidth={2} />
                <div className="text">Print</div>
              </div>
            </div>
          </div>
          <div className="pbm-submenu">
            <NavLink to={"/"} className={`pbm-submenu-link`}>
              <LibraryBig className="icon" strokeWidth={2} />
              <div className="text">Mata kuliah</div>
            </NavLink>
            <NavLink to={"/kelas"} className={`pbm-submenu-link`}>
              <Blocks className="icon" strokeWidth={2} />
              <div className="text">Kelas</div>
            </NavLink>
            <NavLink to={"/jadwal-perkuliahan"} className={`pbm-submenu-link`}>
              <CalendarFold className="icon" strokeWidth={2} />
              <div className="text">Jadwal perkuliahan</div>
            </NavLink>
          </div>
          <div className="pbm-content">{children}</div>
        </div>
      </Layout>
      <div
        style={{
          display: "none",
        }}
      >
        {content && <Document ref={printRef} data={content} />}
      </div>
    </>
  );
}

export default PBMLink;
