import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { useSearch } from "@/context/SearchContext";
import { useDashboard } from "@/context/DashboardContext";
import { apiOptions } from "@/hooks/useApiSevima";
import { formatDate } from "@/helpers/FormatDate";
import { toastMessage } from "@/helpers/AlertMessage";

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
              const response = await apiOptions.get("perkuliahan", {
                params: { idkelas },
              });

              // console.log(response.data.data);

              return response.data.data;
            } catch (err) {
              console.error(err);
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

        setJurnalData(mergedData);

        // console.log(mergedData);
        // console.log(uniqueData);

        const errors = jurnalResults
          .filter((result) => result.status === "rejected")
          .map((result) => result.reason.message);

        if (errors.length > 0) {
          console.warn("Beberapa data tidak bisa diambil:", errors);
          // toastMessage("warn", errors.join("\n"), { position: "top-center" });
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
  }, [kelasIds]);

  useEffect(() => {
    const searchLowerCase = search.toLowerCase();

    const getKelas = (kelas) => {
      if (kelas[1] === "1") return `${kelas[0]}A`;
      if (kelas[1] === "2") return `${kelas[0]}B`;
      if (kelas[1] === "3") return `${kelas[0]}C`;
      if (kelas[1] === "4") return `${kelas[0]}D`;
      if (kelas[1] === "5") return `${kelas[0]}E`;
      return null;
    };

    const filtered = jurnalData
      .filter((item) =>
        filterMatkul.length === 0 ? true : filterMatkul.includes(item.id_kelas)
      )
      .filter((item) => {
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
