import { useEffect, useState } from "react";
import { useFetchTemporary } from "@/hooks/useApiSevima";
import { useSearch } from "@/context/SearchContext";
import { useDashboard } from "@/context/DashboardContext";
import { formatDate } from "@/helpers/FormatDate";
import { toastMessage } from "@/helpers/AlertMessage";
import PropTypes from "prop-types";

function useJurnalPerkuliahan({ kelasIds, filterMatkul = [] }) {
  const { search } = useSearch(); // Input pencarian
  const [jurnalData, setJurnalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Data setelah filter pencarian
  const [currentData, setCurrentData] = useState([]);
  const [indexFirstItem, setIndexFirstItem] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const { expandedSidebar } = useDashboard();

  useEffect(() => {
    const fetchJurnalData = async () => {
      if (kelasIds.length === 0) return;

      try {
        setIsLoading(true);

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

        const successfulData = jurnalResults
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value)
          .flat()
          .map((result) => result.attributes)
          .flat();

        setJurnalData(successfulData);

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchJurnalData();
  }, [kelasIds, toastMessage]);

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

  return {
    filteredData,
    currentData,
    indexFirstItem,
    currentPage,
    setCurrentPage,
    handlePageDataChange,
    expandedSidebar,
    isLoading,
  };
}

useJurnalPerkuliahan.propTypes = {
  kelasIds: PropTypes.array,
  filterMatkul: PropTypes.array,
};

export default useJurnalPerkuliahan;
