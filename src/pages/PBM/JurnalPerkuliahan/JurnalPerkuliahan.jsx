import React, { useCallback, useEffect, useState } from "react";
import Pagination from "@/components/Pagination/Pagination";
import { useFetchTemporary } from "../../../helpers/useApiSevima";
// import Loader from "@/components/Loader/Loader";
import { useSearch } from "@/helpers/SearchContext";
import { useDashboard } from "../../../context/DashboardContext";
import { formatDate } from "../../../helpers/FormatDate";
import { toastMessage } from "../../../helpers/AlertMessage";

function JurnalPerkuliahan({ kelasIds, filterMatkul = [] }) {
  const { search } = useSearch(); // Input pencarian
  const [jurnalData, setJurnalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Data setelah filter pencarian
  const [currentData, setCurrentData] = useState([]);
  const [indexFirstItem, setIndexFirstItem] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const { expandedSidebar } = useDashboard();

  useEffect(() => {
    const fetchJurnalData = async () => {
      if (kelasIds.length === 0) return;

      try {
        const jurnalResults = await Promise.allSettled(
          kelasIds.map(async (idkelas) => {
            try {
              const result = await useFetchTemporary({
                queryKey: ["perkuliahan", idkelas],
              });
              return result.data;
            } catch (err) {
              throw new Error(
                `Gagal mengambil data untuk ID kelas: ${idkelas}`
              );
            }
          })
        );

        // console.log(jurnalResults);
        

        // Filter hanya hasil yang sukses (fulfilled)
        const successfulData = jurnalResults
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value)
          .flat()
          .map((result) => result.attributes)
          .flat();

        setJurnalData(successfulData);

        // Handle dan tampilkan error jika ada
        const errors = jurnalResults
          .filter((result) => result.status === "rejected")
          .map((result) => result.reason.message);

        if (errors.length > 0) {
          console.warn("Beberapa data tidak bisa diambil:", errors);
          toastMessage("warn", errors.join("\n"), { position: "top-center" });
        }
      } catch (error) {
        console.error("Error fetching jurnal data:", error);
        toastMessage("error", "Terjadi kesalahan saat mengambil data jurnal", {
          position: "top-center",
        });
      }
    };

    fetchJurnalData();
  }, [kelasIds, toastMessage]);

  // Filter data berdasarkan pencarian dan reset ke halaman pertama
  useEffect(() => {
    const searchLowerCase = search.toLowerCase();
    const filtered = jurnalData
      .filter((item) =>
        filterMatkul.length === 0 ? true : filterMatkul.includes(item.id_kelas)
      )
      .filter(
        (item) =>
          item?.mata_kuliah?.toLowerCase().includes(searchLowerCase) ||
          item?.nomor_pertemuan?.toLowerCase().includes(searchLowerCase) ||
          formatDate(item?.tanggal)?.toLowerCase().includes(searchLowerCase) ||
          item?.rencana_materi?.toLowerCase().includes(searchLowerCase) ||
          item?.bahasan?.toLowerCase().includes(searchLowerCase)
      );

    setFilteredData(filtered);
    setCurrentPage(1);

    // console.log(filtered);
  }, [search, jurnalData, filterMatkul]);

  const handlePageDataChange = (currentData, indexOfFirstItem) => {
    setCurrentData(currentData);
    setIndexFirstItem(indexOfFirstItem);
  };

  return (
    <>
      <div
        className={`pbm-table jurnal-perkuliahan ${
          expandedSidebar === false ? "expanded" : ""
        }`}
      >
        <div className="thead">
          <div className="row">No</div>
          <div className="row">Mata Kuliah</div>
          <div className="row">Pertemuan</div>
          <div className="row">Hari / Tanggal</div>
          <div className="row">Rencana Materi</div>
          <div className="row">Realisasi Materi</div>
        </div>
        {currentData.map((data, index) => (
          <div className="tbody" key={index}>
            <div className="col">{indexFirstItem + index + 1}</div>
            <div className="col">{data.mata_kuliah}</div>
            <div className="col">{data.nomor_pertemuan}</div>
            <div className="col">{formatDate(data.tanggal)}</div>
            <div className="col">{data.rencana_materi}</div>
            <div className="col">{data.bahasan}</div>
          </div>
        ))}
      </div>

      <Pagination
        data={filteredData}
        itemsPerPage={10}
        onPageDataChange={handlePageDataChange}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
}

export default JurnalPerkuliahan;
