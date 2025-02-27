import { useEffect, useState, useRef, useCallback } from "react";
import { RefreshCw, ArrowDownRight, DatabaseBackup } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { useFetchData, apiOptions } from "../../hooks/useApiSevima";
import { useDashboard } from "@/context/DashboardContext";
import Header from "@/components/Header/Header";
import Loader from "@/components/Loader/Loader";
import useClickOutside from "@/hooks/useClickOutside";
import { useSearch } from "@/context/SearchContext";
import { formatDate } from "@/helpers/FormatDate";
import { toastMessage } from "@/helpers/AlertMessage";
import Pagination from "@/components/Pagination/Pagination";
import EmptyData from "@/components/EmptyData/EmptyData";

function Sinkronisasi() {
  const [kelasIds, setKelasIds] = useState([]);
  const [periodeData, setPeriodeData] = useState([]);
  const [openPeriode, setOpenPeriode] = useState(false);
  const [selectedPeriode, setSelectedPeriode] = useState("20241");
  const { search } = useSearch();
  const [allData, setAllData] = useState([]);
  const [DisplayData, setDisplayData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [indexFirstItem, setIndexFirstItem] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPresensi, setSelectedPresensi] = useState("");
  const [loadingPresensi, setLoadingPresensi] = useState(false);
  const [selectedTranskrip, setSelectedTranskrip] = useState(null);
  const [loadingTranskrip, setLoadingTranskrip] = useState(false);

  const periodeModal = useRef(null);
  const { user } = useDashboard();

  // Fetch data kelas
  const {
    data: kelasData,
    isLoading: isLoadingKelas,
    isError: isErrorKelas,
  } = useQuery({
    queryKey: [
      `matakuliah/${
        user.id_pegawai ? user.id_pegawai : user.role[0]?.id_pegawai
      }`,
      1,
    ],
    queryFn: useFetchData,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });

  useClickOutside(periodeModal, () => setOpenPeriode(false), openPeriode);

  useEffect(() => {
    if (kelasData) {
      // console.log(kelasData);
      const ids = kelasData.data.map((item) => item.attributes.id_kelas);
      setKelasIds(ids);

      const getPeriode = [
        ...new Set(kelasData.data.map((item) => item.attributes.id_periode)),
      ];
      const sortedPeriode = getPeriode.sort((a, b) => {
        return b - a;
      });
      setPeriodeData(sortedPeriode);
    }
  }, [kelasData]);

  //   useEffect(() => {
  //     console.log(periodeData);
  //   }, [periodeData]);

  useEffect(() => {
    const fetchDisplayData = async () => {
      if (kelasIds.length === 0) return;

      try {
        setIsLoading(true);

        const displayResults = await Promise.allSettled(
          kelasIds.map(async (idkelas) => {
            try {
              const response = await apiOptions.get("perkuliahan", {
                params: { idkelas },
              });

              // console.log(response.data.data);

              return response.data.data;
            } catch (err) {
              // console.error(err);
              throw new Error(
                `Gagal mengambil data untuk ID kelas: ${idkelas}`
              );
            }
          })
        );

        const successfulData = displayResults
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value)
          .flat()
          .map((result) => result.attributes)
          .flat();

        setAllData(successfulData);
        // console.log(successfulData);

        // const uniqueData = Array.from(
        //   new Map(successfulData.map((item) => [item.id_kelas, item])).values()
        // );

        const totalMeet = successfulData.reduce((acc, curr) => {
          acc[curr.id_kelas] = (acc[curr.id_kelas] || 0) + 1;

          return acc;
        }, {});

        const lastMeet = successfulData.reduce((acc, curr) => {
          // Jika id_kelas belum ada di accumulator, atau nomor_pertemuan lebih besar dari yang sudah ada
          if (
            !acc[curr.id_kelas] ||
            curr.nomor_pertemuan > acc[curr.id_kelas].nomor_pertemuan
          ) {
            acc[curr.id_kelas] = curr;
          }
          return acc;
        }, {});

        // Konversi kembali menjadi array jika diperlukan
        const lastMeetArray = Object.values(lastMeet);

        const mergedData = lastMeetArray.map((item) => ({
          ...item,
          total_pertemuan: totalMeet[item.id_kelas],
        }));

        mergedData.sort((a, b) => {
          return b.id_periode - a.id_periode; // Mengurutkan dari yang terbaru ke yang lama
        });

        setDisplayData(mergedData);

        // console.log(mergedData);
        // console.log(uniqueData);

        const errors = displayResults
          .filter((result) => result.status === "rejected")
          .map((result) => result.reason.message);

        if (errors.length > 0) {
          // console.warn("Beberapa data tidak bisa diambil:", errors);
          // toastMessage("warn", errors.join("\n"), { position: "top-center" });
        }
      } catch (error) {
        console.error("Error fetching display data:", error);
        toastMessage("error", "Terjadi kesalahan saat mengambil data display", {
          position: "top-center",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDisplayData();
  }, [kelasIds]);

  useEffect(() => {
    const searchLowerCase = search.toLowerCase();

    const containsAlphabet = (str) => /[a-zA-Z]/.test(str);

    const getKelas = (kelas) => {
      if (containsAlphabet(kelas)) {
        return kelas;
      }

      const mapping = {
        1: "A",
        2: "B",
        3: "C",
        4: "D",
        5: "E",
      };

      return mapping[kelas[1]] ? `${kelas[0]}${mapping[kelas[1]]}` : null;
    };

    const filtered = DisplayData.filter(
      (item) => item.id_periode === selectedPeriode
    ).filter((item) => {
      const kelas = getKelas(item?.nama_kelas)?.toLowerCase();

      return (
        item?.mata_kuliah?.toLowerCase().includes(searchLowerCase) ||
        kelas.includes(searchLowerCase) ||
        formatDate(item?.tanggal)?.toLowerCase().includes(searchLowerCase) ||
        item?.id_periode?.toLowerCase().includes(searchLowerCase) ||
        item?.total_pertemuan
          ?.toString()
          ?.toLowerCase()
          .includes(searchLowerCase)
      );
    });

    setFilteredData(filtered);
    setCurrentPage(1);

    // console.log(filtered);
  }, [search, DisplayData, selectedPeriode]);

  const handlePageDataChange = (currentData, indexOfFirstItem) => {
    setCurrentData(currentData);
    setIndexFirstItem(indexOfFirstItem);
  };

  useEffect(() => {
    if (selectedPresensi !== "") {
      setLoadingPresensi(true);
      toastMessage(
        "info",
        "Proses sinkronisasi diperkirakan selesai setelah 4 menit."
      );

      const handlePresensi = async () => {
        try {
          const idPerkuliahanList = allData
            .filter((item) => item.mata_kuliah === selectedPresensi)
            .map((data) => ({ id_perkuliahan: data.id_perkuliahan }));

          const response = await apiOptions.post(
            "perkuliahan/presensi",
            idPerkuliahanList
          );

          console.log(response.status);
        } catch (error) {
          console.error("Terjadi kesalahan saat mengirim presensi:", error);
        }
      };

      handlePresensi();

      const timeout = setTimeout(() => {
        toastMessage("success", "Sinkronisasi presensi berhasil dilakukan.");
        setLoadingPresensi(false);
        setSelectedPresensi("");
      }, 240000);

      return () => {
        clearTimeout(timeout);
        setLoadingPresensi(false);
      };
    }
  }, [selectedPresensi, allData]);

  useEffect(() => {
    if (selectedTranskrip) {
      setLoadingTranskrip(true);

      apiOptions
        .get(`/sinkron/transkrip/mahasiswa/${selectedTranskrip}`)
        .then((res) => {
          console.log(res.data);
          toastMessage("success", res.data.status);
        })
        .catch((err) => {
          console.error(err);
          toastMessage(
            "error",
            "Dimohon untuk melakukan sinkronisasi presensi terlebih dahulu"
          );
        })
        .finally(() => {
          setSelectedTranskrip(null);
          setLoadingTranskrip(false);
        });
    }
  }, [selectedTranskrip]);

  if (isLoadingKelas) return <Loader />;
  if (isErrorKelas)
    return (
      <div className="sinkronisasi">
        <Header
          classEl={"sinkronisasi"}
          titleEl={"Sinkronisasi Data"}
          descEl={"Memperbarui data server dengan data terbaru SEVIMA"}
          Icon={RefreshCw}
        ></Header>
        <div className="sinkronisasi-message">
          Error dalam mengambil data kelas dikarenakan request menuju server
          sedang sibuk. Mohon maaf atas ketidaknyamanan yang ditimbulkan.
          Silahkan refresh untuk mengambil data kelas kembali.
        </div>
      </div>
    );

  return (
    <div className="sinkronisasi">
      <Header
        classEl={"sinkronisasi"}
        titleEl={"Sinkronisasi Data"}
        descEl={"Memperbarui data server dengan data terbaru SEVIMA"}
        Icon={DatabaseBackup}
      ></Header>
      {loadingPresensi || loadingTranskrip ? (
        <Loader text="Sinkronisasi sedang berlansung, mohon tunggu..." />
      ) : (
        <div className="sinkronisasi-content">
          <div className="sinkronisasi-content-filter">
            <div className="periode-modal">
              <div className="periode-modal-title">Periode Mata Kuliah</div>
              <div
                className="periode-modal-default"
                onClick={() => setOpenPeriode(true)}
              >
                <span>{selectedPeriode}</span>
                <ArrowDownRight
                  className={`icon ${openPeriode ? "show" : ""}`}
                  strokeWidth={1.5}
                />
              </div>
              {openPeriode ? (
                <div className="periode-modal-list" ref={periodeModal}>
                  {periodeData
                    .filter((item) => item !== selectedPeriode)
                    .map((data, index) => {
                      return (
                        <span
                          key={index}
                          onClick={() => {
                            setSelectedPeriode(data);
                            setOpenPeriode(false);
                          }}
                        >
                          {data}
                        </span>
                      );
                    })}
                </div>
              ) : null}
            </div>
          </div>
          <div className="sinkronisasi-content-table">
            {isLoading ? (
              <Loader />
            ) : (
              <>
                <div className="thead">
                  <div className="row">No</div>
                  <div className="row">Mata Kuliah</div>
                  <div className="row">Kelas</div>
                  <div className="row">Presensi</div>
                  <div className="row">Transkrip</div>
                </div>
                <EmptyData data={filteredData} />
                {currentData.map((data, index) => {
                  const containsAlphabet = (str) => /[a-zA-Z]/.test(str);

                  const getClassName = (data) => {
                    if (containsAlphabet(data)) {
                      return data;
                    }

                    const mapping = {
                      1: "A",
                      2: "B",
                      3: "C",
                      4: "D",
                      5: "E",
                    };

                    return mapping[data[1]]
                      ? `${data[0]}${mapping[data[1]]}`
                      : null;
                  };

                  return (
                    <>
                      <div className="tbody" key={index}>
                        <div className="col">{indexFirstItem + index + 1}</div>
                        <div className="col">{data.mata_kuliah}</div>
                        <div className="col">
                          {getClassName(data.nama_kelas)}
                        </div>
                        <div className="col">
                          <div
                            className="refresh"
                            onClick={() =>
                              setSelectedPresensi(data.mata_kuliah)
                            }
                          >
                            <RefreshCw
                              className="refresh-icon"
                              strokeWidth={1.5}
                            />
                          </div>
                        </div>
                        <div className="col">
                          <div
                            className="refresh"
                            onClick={() => setSelectedTranskrip(data.id_kelas)}
                          >
                            <RefreshCw
                              className="refresh-icon"
                              strokeWidth={1.5}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}

                <Pagination
                  data={filteredData}
                  itemsPerPage={10}
                  onPageDataChange={handlePageDataChange}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Sinkronisasi;
