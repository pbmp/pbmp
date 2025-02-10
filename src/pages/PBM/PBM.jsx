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
  ClipboardList,
  UserRoundCheck,
  Filter,
  Square,
  SquareCheckBig,
} from "lucide-react";
import HeaderEl from "@/components/HeaderEl/HeaderEl";
import JurnalPerkuliahan from "./JurnalPerkuliahan/JurnalPerkuliahan";
import Presensi from "./Presensi/Presensi";
import Transkrip from "./Transkrip/Transkrip";
import { useFetchData, apiOptionsNoTimeout } from "../../helpers/useApiSevima";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader/Loader";
import { useDashboard } from "@/context/DashboardContext";
import { toastMessage } from "../../helpers/AlertMessage";
import { formatName } from "../../helpers/FormatName";

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
  const [openFilter, setOpenFilter] = useState(false);
  const [filterMatakuliah, setFilterMatakuliah] = useState([]);
  const [tempFilterMatakuliah, setTempFilterMatakuliah] = useState([]);

  const filterModal = useRef(null);
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

  useEffect(() => {
    console.log(user);
  }, [user]);

  useEffect(() => {
    if (kelasData?.data) {
      const ids = kelasData.data.map((item) => item.attributes.id_kelas);
      setKelasIds(ids);

      // console.log(kelasData);

      const getPeriode = [
        ...new Set(kelasData.data.map((item) => item.attributes.id_periode)),
      ];
      setPeriodeData(getPeriode);
    }
  }, [kelasData]);

  const handleClickOutside = useCallback(
    (e) => {
      if (periodeModal.current && !periodeModal.current.contains(e.target)) {
        setOpenPeriode(false);
      } else if (
        filterModal.current &&
        !filterModal.current.contains(e.target)
      ) {
        setOpenFilter(false);
      }
    },
    [periodeModal, filterModal]
  );

  useEffect(() => {
    if (openPeriode || openFilter) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openPeriode, openFilter, handleClickOutside]);

  const handleFilterMatakuliah = useCallback((id) => {
    setTempFilterMatakuliah((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  // const handlePrint = useCallback(
  //   async (periodeId) => {
  //     try {
  //       setLoadingPrint(true);

  //       const promise = await apiOptionsNoTimeout.get("/laporan/pbmp", {
  //         params: {
  //           idpegawai: user.role[0]?.id_pegawai,
  //           idperiode: periodeId,
  //         },
  //       });

  //       if (promise.data?.success) {
  //         toastMessage("success", "Printing successfully!");

  //         const newTab = window.open(
  //           `https://docs.google.com/document/d/${promise.data.id_docs}/edit?tab=t.0`,
  //           "_blank"
  //         );

  //         if (!newTab) {
  //           toastMessage(
  //             "info",
  //             "Popup diblokir! Silakan aktifkan izin popup untuk membuka dokumen dan mohon cetak kembali.",
  //             {
  //               autoClose: 5000,
  //             }
  //           );
  //         }
  //       } else {
  //         toastMessage("error", "Gagal mencetak laporan!");
  //       }
  //     } catch (error) {
  //       console.error(error);
  //       toastMessage("error", "Terjadi kesalahan saat mencetak laporan!");
  //     } finally {
  //       setLoadingPrint(false);
  //     }
  //   },
  //   [user, kelasData, setLoadingPrint]
  // );

  const handlePrint = useCallback(
    async (periodeId) => {
      try {
        setLoadingPrint(true);

        const response = await apiOptionsNoTimeout.get("/laporan/pbmp", {
          params: {
            idpegawai: user.role[0]?.id_pegawai,
            idperiode: periodeId,
          },
          responseType: "blob", // Penting agar response dikembalikan dalam format blob
        });

        const blob = response.data;
        const fileUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = fileUrl;
        a.download = `Laporan_${periodeId}_${formatName(user.nama)}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(fileUrl);

        toastMessage("success", "File berhasil diunduh!");
      } catch (error) {
        console.error("Error fetching PDF:", error);
        toastMessage("error", `Gagal mengunduh file: ${error.message}`);
      } finally {
        setLoadingPrint(false);
      }
    },
    [user, setLoadingPrint, toastMessage]
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
              <div className="pbm-feature">
                <div className="pbm-feature-submenu">
                  {submenus.map((item) => (
                    <div
                      key={item.id}
                      className={`pbm-feature-submenu-link ${
                        activeSubmenu === item.id ? "active" : ""
                      }`}
                      onClick={() => handleActiveSubmenu(item.id)}
                    >
                      {item.icon}
                      <div className="text">{item.text}</div>
                    </div>
                  ))}
                </div>
                <div className="pbm-feature-filter">
                  <div
                    className="add-filters"
                    onClick={() => setOpenFilter(true)}
                  >
                    <Filter className="icon" strokeWidth={1.75} />
                    <div className="text">Add Filters</div>
                    {openFilter ? (
                      <div className="filter-modal" ref={filterModal}>
                        <div className="filter-modal-content">
                          <div className="filter-by">Matakuliah</div>
                          <div className="filter-list">
                            {kelasData.data.map((item, index) => {
                              const activeFilter =
                                tempFilterMatakuliah?.includes(
                                  item.attributes.id_kelas
                                );

                              return (
                                <div
                                  className={`filter-list-item`}
                                  key={index}
                                  onClick={() =>
                                    handleFilterMatakuliah(
                                      item.attributes.id_kelas
                                    )
                                  }
                                >
                                  {activeFilter ? (
                                    <SquareCheckBig
                                      strokeWidth={1.75}
                                      className="icon"
                                    />
                                  ) : (
                                    <Square
                                      strokeWidth={1.25}
                                      className="icon"
                                    />
                                  )}
                                  <div className="text">
                                    {item.attributes.id_periode} -{" "}
                                    {item.attributes.mata_kuliah}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <div className="filter-modal-button">
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenFilter(false);
                            }}
                          >
                            cancel
                          </span>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              setFilterMatakuliah(tempFilterMatakuliah);
                              setOpenFilter(false);
                            }}
                          >
                            apply
                          </span>
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div
                    className="clear-filter"
                    onClick={() => {
                      setFilterMatakuliah([]);
                      setTempFilterMatakuliah([]);
                    }}
                  >
                    <div className="text">Clear Filter</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        {loadingPrint ? (
          <Loader text="Printing Document on Progress..." />
        ) : (
          <div className="pbm-content">
            {activeSubmenu === 1 && (
              <JurnalPerkuliahan
                kelasIds={kelasIds}
                filterMatkul={filterMatakuliah}
              />
            )}
            {activeSubmenu === 2 && (
              <Presensi kelasIds={kelasIds} filterMatkul={filterMatakuliah} />
            )}
            {activeSubmenu === 3 && <Transkrip />}
          </div>
        )}
      </Layout>
    </>
  );
}

export default PBM;
