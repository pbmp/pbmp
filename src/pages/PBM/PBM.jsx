import React, { useRef, useState } from "react";
import Layout from "@/components/Layout/Layout";
import {
  FileText,
  Printer,
  CloudDownload,
  LibraryBig,
  Blocks,
  Calendar1,
  CalendarFold,
  SquareCheckBig,
  ClipboardList,
  UserRoundCheck,
} from "lucide-react";
import HeaderEl from "@/components/HeaderEl/HeaderEl";
import { useReactToPrint } from "react-to-print";
import Document from "./Document/Document";
import JurnalPerkuliahan from "./JurnalPerkuliahan/JurnalPerkuliahan";
import Presensi from "./Presensi/Presensi";
import Transkrip from "./Transkrip/Transkrip";

const submenus = [
  {
    id: 1,
    icon: <LibraryBig className="icon" strokeWidth={2} />,
    text: "Jurnal Perkuliahan",
  },
  // {
  //   icon: <Blocks className="icon" strokeWidth={2} />,
  //   text: "Kelas",
  // },
  // {
  //   icon: <Calendar1 className="icon" strokeWidth={2} />,
  //   text: "Jadwal Perkuliahan",
  // },
  {
    id: 2,
    icon: <UserRoundCheck className="icon" strokeWidth={2} />,
    text: "Presensi",
  },
  {
    id: 3,
    icon: <ClipboardList className="icon" strokeWidth={2} />,
    text: "Transkrip",
  },
];

function PBM() {
  const [activeSubmenu, setActiveSubmenu] = useState(1);
  const printRef = useRef(null);

  const handleActiveSubmenu = (id) => {
    setActiveSubmenu(id);
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
            {submenus.map((item) => (
              <div
                key={item.id}
                className={`pbm-submenu-link ${
                  activeSubmenu === item.id ? "active" : ""
                }`}
                onClick={() => handleActiveSubmenu(item.id)}
              >
                {item.icon}
                <div className="text">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="pbm-content">
          {activeSubmenu === 1 && <JurnalPerkuliahan />}
          {activeSubmenu === 2 && <Presensi />}
          {activeSubmenu === 3 && <Transkrip />}
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
