import { useEffect, useState } from "react";
import { apiOptions } from "@/hooks/useApiSevima";
import { useSearch } from "@/context/SearchContext";
import { useDashboard } from "@/context/DashboardContext";
import { toastMessage } from "@/helpers/AlertMessage";
import PropTypes from "prop-types";

function useTranskrip({ kelasIds, filterMatkul = [] }) {
  const { search } = useSearch();
  const [KHSData, setKHSData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
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

        const [KHSResults, NameResults] = await Promise.all([
          Promise.allSettled(
            kelasIds.map(async (idkelas) => {
              try {
                const result = await apiOptions.get(
                  `/data/transkrip/${idkelas}`
                );
                return result.data.map((item) => item.attributes);
              } catch (err) {
                console.error(err);
                throw new Error(
                  `Gagal mengambil data KHS untuk ID kelas: ${idkelas}`
                );
              }
            })
          ),
          Promise.allSettled(
            kelasIds.map(async (idkelas) => {
              try {
                const result = await apiOptions.get(`/nilai/${idkelas}`);
                return result.data.map((item) => ({
                  nim: item.attributes.nim,
                  nama_mahasiswa: item.attributes.nama_mahasiswa,
                }));
              } catch (err) {
                console.error(err);
                throw new Error(
                  `Gagal mengambil data Nama untuk ID kelas: ${idkelas}`
                );
              }
            })
          ),
        ]);

        const successfulKHSData = KHSResults.filter(
          (res) => res.status === "fulfilled"
        ).flatMap((res) => res.value);
        const successfulNameData = NameResults.filter(
          (res) => res.status === "fulfilled"
        ).flatMap((res) => res.value);

        const nameMap = new Map(
          successfulNameData.map((data) => [data.nim, data.nama_mahasiswa])
        );

        // const uniqueKHSData = [
        //   ...new Map(
        //     successfulKHSData
        //       .reverse()
        //       .map((data) => [`${data.nim}-${data.mata_kuliah}`, data])
        //   ).values(),
        // ];

        const mergedData = successfulKHSData.map((khsItem) => ({
          ...khsItem,
          nama_mahasiswa: nameMap.get(khsItem.nim) || "Tidak Diketahui",
        }));

        setKHSData(mergedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toastMessage(
          "warn",
          "Terjadi kesalahan saat mengambil data transkrip",
          {
            position: "top-center",
          }
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchJurnalData();
  }, [kelasIds]);

  useEffect(() => {
    const searchLowerCase = search.toLowerCase().trim();

    const filtered = KHSData.filter((item) =>
      filterMatkul.length === 0 ? true : filterMatkul.includes(item.id_kelas)
    ).filter((item) => {
      const statusLulus = item.is_lulus == "1" ? "lulus" : "tidak lulus";
      return (
        item.mata_kuliah.toLowerCase().includes(searchLowerCase) ||
        item.nim.toLowerCase().includes(searchLowerCase) ||
        item.nama_mahasiswa.toLowerCase().includes(searchLowerCase) ||
        item.nilai_numerik.toLowerCase().includes(searchLowerCase) ||
        item.nilai_huruf.toLowerCase().includes(searchLowerCase) ||
        statusLulus.includes(searchLowerCase)
      );
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [search, KHSData, filterMatkul]);

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

useTranskrip.propTypes = {
  kelasIds: PropTypes.array,
  filterMatkul: PropTypes.array,
};

export default useTranskrip;
