import { useState, useEffect, useCallback } from "react";
import { useFetchData, apiOptions } from "@/hooks/useApiSevima";
import { useQuery } from "@tanstack/react-query";
import { useDashboard } from "@/context/DashboardContext";
import { toastMessage } from "@/helpers/AlertMessage";
import { formatName } from "@/helpers/FormatName";

export function usePBM() {
  const [activeSubmenu, setActiveSubmenu] = useState(1);
  const [kelasIds, setKelasIds] = useState([]);
  const [loadingPrint, setLoadingPrint] = useState(false);
  const [matkulData, setMatkulData] = useState([]);
  const [filterMatakuliah, setFilterMatakuliah] = useState([]);
  const [tempFilterMatakuliah, setTempFilterMatakuliah] = useState([]);
  const [periodeData, setPeriodeData] = useState([]);
  const [filterPeriode, setFilterPeriode] = useState(["20241"]);
  const [tempFilterPeriode, setTempFilterPeriode] = useState(["20241"]);

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

  // useEffect(() => {
  //   console.log(user);
  // }, [user]);

  useEffect(() => {
    if (kelasData?.data) {
      const ids = kelasData.data.map((item) => item.attributes.id_kelas);
      setKelasIds(ids);

      // console.log(kelasData);

      const getMatkul = Object.values(
        kelasData.data.reduce((acc, item) => {
          const matkul = item.attributes.mata_kuliah;
          const idPeriode = item.attributes.id_periode;

          if (!acc[matkul]) {
            acc[matkul] = { mata_kuliah: matkul, id_periode: new Set() };
          }

          acc[matkul].id_periode.add(idPeriode);

          return acc;
        }, {})
      ).map((item) => ({
        ...item,
        id_periode: Array.from(item.id_periode), // Convert Set to Array
      }));

      setMatkulData(getMatkul);

      const getPeriode = [
        ...new Set(kelasData.data.map((item) => item.attributes.id_periode)),
      ];
      const sortedPeriode = getPeriode.sort((a, b) => {
        return b - a;
      });
      setPeriodeData(sortedPeriode);
    }
  }, [kelasData]);

  const handleFilterMatakuliah = useCallback((id) => {
    setTempFilterMatakuliah((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  const handleFilterPeriode = useCallback((id) => {
    setTempFilterPeriode((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  const handlePrint = useCallback(
    async (kelasId, periodeId) => {
      if (kelasData) {
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

          const matkulCode = kelasData.data.find(
            (item) => item.attributes.id_kelas === kelasId
          ).attributes.kode_mata_kuliah;
          const getKelas = kelasData.data.find(
            (item) => item.attributes.id_kelas === kelasId
          );
          const kelas =
            getKelas.attributes.nama_kelas[1] === "1"
              ? `${getKelas.attributes.nama_kelas[0]}A`
              : getKelas.attributes.nama_kelas[1] === "2"
              ? `${getKelas.attributes.nama_kelas[0]}B`
              : getKelas.attributes.nama_kelas[1] === "3"
              ? `${getKelas.attributes.nama_kelas[0]}C`
              : getKelas.attributes.nama_kelas[1] === "4"
              ? `${getKelas.attributes.nama_kelas[0]}D`
              : getKelas.attributes.nama_kelas[1] === "5"
              ? `${getKelas.attributes.nama_kelas[0]}E`
              : null;

          a.download = `LaporanBKD_${periodeId}_${formatName(
            matkulCode,
            "matkul"
          )}_${kelas}_${formatName(
            user.nama ? user.nama : user.name,
            "name"
          )}.pdf`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(fileUrl);

          toastMessage("success", "File berhasil diunduh!");
        } catch (error) {
          console.error("Error fetching PDF:", error);
          toastMessage(
            "error",
            `Gagal mengunduh file dikarenakan data kelas yang dimaksud belum tersinkron`
          );
          toastMessage(
            "info",
            `Dimohon untuk mencoba kembali besok setelah pukul 03.00 WIB`
          );
        } finally {
          setLoadingPrint(false);
        }
      }
    },
    [user, setLoadingPrint, kelasData]
  );

  return {
    activeSubmenu,
    setActiveSubmenu,
    kelasIds,
    kelasData,
    matkulData,
    filterMatakuliah,
    setFilterMatakuliah,
    tempFilterMatakuliah,
    setTempFilterMatakuliah,
    periodeData,
    filterPeriode,
    setFilterPeriode,
    tempFilterPeriode,
    setTempFilterPeriode,
    loadingPrint,
    isLoadingKelas,
    isErrorKelas,
    handleFilterMatakuliah,
    handleFilterPeriode,
    handlePrint,
  };
}
