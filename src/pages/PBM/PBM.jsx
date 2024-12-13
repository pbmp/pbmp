import React, { useRef, useState } from "react";
import Layout from "@/components/Layout/Layout";
import {
  FileText,
  Printer,
  CloudDownload,
  LibraryBig,
  Blocks,
  CalendarFold,
} from "lucide-react";
import HeaderEl from "@/components/HeaderEl/HeaderEl";
import { useReactToPrint } from "react-to-print";
import Document from "./Document/Document";
import Kelas from "./Kelas/Kelas";
import JadwalPerkuliahan from "./JadwalPerkuliahan/JadwalPerkuliahan";
import MataKuliah from "./MataKuliah/MataKuliah";

const submenus = [
  {
    icon: <LibraryBig className="icon" strokeWidth={2} />,
    text: "Mata kuliah",
  },
  {
    icon: <Blocks className="icon" strokeWidth={2} />,
    text: "Kelas",
  },
  {
    icon: <CalendarFold className="icon" strokeWidth={2} />,
    text: "Jadwal perkuliahan",
  },
];

function PBM() {
  const [activeSubmenu, setActiveSubmenu] = useState(0);
  const printRef = useRef(null);

  const handleActiveSubmenu = (index) => {
    setActiveSubmenu(index);
  };

  const content = "semester genap tahun akademik 2023/2024";

  return (
    <>
      <Layout>
        <div className="pbm">
          <HeaderEl
            classEl={"pbm"}
            titleEl={"PBM"}
            descEl={"Laporan Kinerja Dosen"}
            Icon={FileText}
          >
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
          </HeaderEl>

          <div className="pbm-submenu">
            {submenus.map((item, index) => (
              <div
                key={index}
                className={`pbm-submenu-link ${
                  activeSubmenu === index ? "active" : ""
                }`}
                onClick={() => handleActiveSubmenu(index)}
              >
                {item.icon}
                <div className="text">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="pbm-content">
          {activeSubmenu === 0 && <MataKuliah />}
          {activeSubmenu === 1 && <Kelas />}
          {activeSubmenu === 2 && <JadwalPerkuliahan />}
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

export default PBM;
