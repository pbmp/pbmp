import { useEffect, useState } from "react";
import { apiOptions } from "@/hooks/useApiSevima";
import { useSearch } from "@/context/SearchContext";
import { useDashboard } from "@/context/DashboardContext";
import { toastMessage } from "@/helpers/AlertMessage";
import PropTypes from "prop-types";

function usePresensi({ kelasIds, filterMatkul = [] }) {
  const { search } = useSearch();
  const [presensiData, setPresensiData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [indexFirstItem, setIndexFirstItem] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const { expandedSidebar } = useDashboard();

  useEffect(() => {
    const fetchPresensiData = async () => {
      if (kelasIds.length === 0) return;

      try {
        setLoading(true);

        const presensiResults = await Promise.allSettled(
          kelasIds.map(async (idkelas) => {
            try {
              const response = await apiOptions.get(`/presensi/${idkelas}`);
              return response.data;
            } catch (err) {
              console.error(err);
              throw new Error(
                `Gagal mengambil presensi untuk ID kelas: ${idkelas}`
              );
            }
          })
        );

        const successfulData = presensiResults
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value)
          .flat();

        setPresensiData(successfulData);

        const errors = presensiResults
          .filter((result) => result.status === "rejected")
          .map((result) => result.reason.message);

        if (errors.length > 0) {
          console.warn("Beberapa data tidak bisa diambil:", errors);
          // toastMessage("warn", errors.join("\n"), { position: "top-center" });
        }
      } catch (error) {
        console.error("Error fetching presensi data:", error);
        toastMessage("warn", "Terjadi kesalahan saat mengambil data presensi", {
          position: "top-center",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPresensiData();
  }, [kelasIds]);

  useEffect(() => {
    const searchLowerCase = search.toLowerCase();
    const filtered = presensiData
      .filter((item) =>
        filterMatkul.length === 0 ? true : filterMatkul.includes(item.id_kelas)
      )
      .filter(
        (item) =>
          item?.nama_mata_kuliah?.toLowerCase().includes(searchLowerCase) ||
          item?.id_kelas?.toString()?.toLowerCase().includes(searchLowerCase) ||
          item?.namapengajar
            .replace(/^.*?-/, "")
            ?.toLowerCase()
            .includes(searchLowerCase) ||
          item?.data.nim?.toLowerCase().includes(searchLowerCase) ||
          item?.data.nama?.toLowerCase().includes(searchLowerCase) ||
          item?.data.pertemuan
            ?.toString()
            ?.toLowerCase()
            .includes(searchLowerCase) ||
          item?.data.alfa
            ?.toString()
            ?.toLowerCase()
            .includes(searchLowerCase) ||
          item?.data.hadir
            ?.toString()
            ?.toLowerCase()
            .includes(searchLowerCase) ||
          item?.data.ijin
            ?.toString()
            ?.toLowerCase()
            .includes(searchLowerCase) ||
          item?.data.sakit
            ?.toString()
            ?.toLowerCase()
            .includes(searchLowerCase) ||
          item?.data.presentase
            ?.toString()
            ?.toLowerCase()
            .includes(searchLowerCase)
      );

    setFilteredData(filtered);
    setCurrentPage(1);

    // console.log(filtered);
  }, [search, presensiData, filterMatkul]);

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
    loading,
  };
}

usePresensi.propTypes = {
  kelasIds: PropTypes.array,
  filterMatkul: PropTypes.array,
};

export default usePresensi;
