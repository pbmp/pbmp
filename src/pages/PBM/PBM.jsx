import React, { useRef, useState, useEffect, useCallback } from "react";
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
import { useFetchData, apiOptionsNoTimeout } from "../../helpers/useApiSevima";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader/Loader";
import { useDashboard } from "@/context/DashboardContext";
import { toastMessage } from "../../helpers/AlertMessage";

const submenus = [
  {
    id: 1,
    icon: <LibraryBig className="icon" strokeWidth={2} />,
    text: "Jurnal Perkuliahan",
  },
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
  const [kelasIds, setKelasIds] = useState([]);
  const [periodeData, setPeriodeData] = useState([]);
  const [loadingPrint, setLoadingPrint] = useState(false);
  const [openPeriode, setOpenPeriode] = useState(false);

  const periodeModal = useRef(null);

  const { user } = useDashboard();

  // Fetch data kelas
  const {
    data: kelasData,
    isLoading: isLoadingKelas,
    isError: isErrorKelas,
  } = useQuery({
    queryKey: [`matakuliah/${user.role[0]?.id_pegawai}`, 1],
    queryFn: useFetchData,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });

  // useEffect(() => {
  //   console.log(user);
  // }, [user]);

  useEffect(() => {
    if (kelasData?.data) {
      const ids = kelasData.data.map((item) => item.attributes.id_kelas);
      setKelasIds(ids);

      console.log(kelasData);

      
      const getPeriode = [
        ...new Set(kelasData.data.map((item) => item.attributes.id_periode)),
      ];
      setPeriodeData(getPeriode);
    }
  }, [kelasData]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (periodeModal.current && !periodeModal.current.contains(e.target)) {
        setOpenPeriode(false);
      }
    };

    if (openPeriode) {
      document.addEventListener("mousedown", handleOutside);
    } else {
      document.removeEventListener("mousedown", handleOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, [periodeModal, openPeriode]);

  const handlePrint = useCallback(
    async (periodeId) => {
      try {
        setLoadingPrint(true);

        const promise = await apiOptionsNoTimeout.get("/laporan/pbmp", {
          params: {
            idpegawai: user.role[0]?.id_pegawai,
            idperiode: periodeId,
          },
        });

        if (promise.data?.success) {
          toastMessage("success", "Printing successfully!");

          const newTab = window.open(
            `https://docs.google.com/document/d/${promise.data.id_docs}/edit?tab=t.0`,
            "_blank"
          );

          if (!newTab) {
            toastMessage(
              "info",
              "Popup diblokir! Silakan aktifkan izin popup untuk membuka dokumen dan mohon cetak kembali.",
              {
                autoClose: 5000,
              }
            );
          }
        } else {
          toastMessage("error", "Gagal mencetak laporan!");
        }
      } catch (error) {
        console.error(error);
        toastMessage("error", "Terjadi kesalahan saat mencetak laporan!");
      } finally {
        setLoadingPrint(false);
      }
    },
    [user, kelasData, setLoadingPrint]
  );

  const handleActiveSubmenu = (id) => {
    setActiveSubmenu(id);
  };

  if (isLoadingKelas) return <Loader />;
  if (isErrorKelas) return <p>Error fetching data</p>;

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
              {/* <div className="download">
                <CloudDownload className="icon" strokeWidth={2} />
                <div className="text">Download</div>
              </div> */}
              <div className="print" onClick={() => setOpenPeriode(true)}>
                <Printer className="icon" strokeWidth={2} />
                <div className="text">Print</div>
              </div>
              {openPeriode ? (
                <div className="periode-modal" ref={periodeModal}>
                  {periodeData.map((data, index) => {
                    return (
                      <div
                        className="periode-modal-content"
                        key={index}
                        onClick={() => handlePrint(data)}
                      >
                        {data}
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </HeaderEl>
          {loadingPrint ? null : (
            <>
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
              <div className="pbm-feature">
                {/* <div className="pbm-feature-core">
                  <div className="add-filters">Add Filters</div>
                  <div className="clear-filter">Clear Filter</div>
                </div> */}
              </div>
            </>
          )}
        </div>
        {loadingPrint ? (
          <Loader text="Printing Document on Progress..." />
        ) : (
          <div className="pbm-content">
            {activeSubmenu === 1 && <JurnalPerkuliahan kelasIds={kelasIds} />}
            {activeSubmenu === 2 && <Presensi kelasIds={kelasIds} />}
            {activeSubmenu === 3 && <Transkrip />}
          </div>
        )}
      </Layout>
    </>
  );
}

export default PBM;
