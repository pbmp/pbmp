import { useRef, useState, useEffect, useCallback } from "react";
import { useFetchData, apiOptions } from "@/hooks/useApiSevima";
import { useQuery } from "@tanstack/react-query";
import { useDashboard } from "@/context/DashboardContext";
import { toastMessage } from "@/helpers/AlertMessage";
import { formatName } from "@/helpers/FormatName";

export function usePBM() {
  const [activeSubmenu, setActiveSubmenu] = useState(1);
  const [kelasIds, setKelasIds] = useState([]);
  const [periodeData, setPeriodeData] = useState([]);
  const [loadingPrint, setLoadingPrint] = useState(false);
  const [openPeriode, setOpenPeriode] = useState(false);
  const [filterMatakuliah, setFilterMatakuliah] = useState([]);
  const [tempFilterMatakuliah, setTempFilterMatakuliah] = useState([]);

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
      }
    },
    [periodeModal]
  );

  useEffect(() => {
    if (openPeriode) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openPeriode, handleClickOutside]);

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
    async (kelasId, periodeId) => {
      try {
        setLoadingPrint(true);

        const response = await apiOptions.get("/laporan/pbmp", {
          params: {
            idkelas: kelasId,
            idperiode: periodeId,
          },
          responseType: "blob",
        });

        const blob = response.data;
        const fileUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = fileUrl;
        a.download = `LaporanBKD_${periodeId}_${formatName(
          kelasData.data.filter(
            (item) => item.attributes.id_kelas === kelasId
          )[0].attributes.kode_mata_kuliah,
          "matkul"
        )}_${formatName(user.nama ? user.nama : user.name, "name")}.pdf`;
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
    [user, setLoadingPrint, kelasData]
  );

  return {
    activeSubmenu,
    setActiveSubmenu,
    kelasIds,
    kelasData,
    periodeData,
    loadingPrint,
    openPeriode,
    setOpenPeriode,
    filterMatakuliah,
    setFilterMatakuliah,
    tempFilterMatakuliah,
    setTempFilterMatakuliah,
    periodeModal,
    isLoadingKelas,
    isErrorKelas,
    handleFilterMatakuliah,
    handlePrint,
  };
}
