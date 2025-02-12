import { useRef, useState, useEffect, useCallback } from "react";
import { useFetchData, apiOptionsNoTimeout } from "../../helpers/useApiSevima";
import { useQuery } from "@tanstack/react-query";
import { useDashboard } from "@/context/DashboardContext";
import { toastMessage } from "../../helpers/AlertMessage";
import { formatName } from "../../helpers/FormatName";

export function usePBM() {
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

  // useEffect(() => {
  //   console.log(user);
  // }, [user]);

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

  const handlePrint = useCallback(
    async (periodeId) => {
      try {
        setLoadingPrint(true);

        const response = await apiOptionsNoTimeout.get("/laporan/pbmp", {
          params: {
            idpegawai: user.role[0]?.id_pegawai,
            idperiode: periodeId,
          },
          responseType: "blob",
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

  return {
    activeSubmenu,
    kelasIds,
    kelasData,
    periodeData,
    loadingPrint,
    openPeriode,
    setOpenPeriode,
    openFilter,
    setOpenFilter,
    filterMatakuliah,
    setFilterMatakuliah,
    tempFilterMatakuliah,
    setTempFilterMatakuliah,
    filterModal,
    periodeModal,
    isLoadingKelas,
    isErrorKelas,
    handleFilterMatakuliah,
    handlePrint,
    handleActiveSubmenu,
  };
}
