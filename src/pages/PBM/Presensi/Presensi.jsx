import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination/Pagination";
import { apiOptions } from "../../../hooks/useApiSevima";
import { useSearch } from "@/context/SearchContext";
import Loader from "@/components/Loader/Loader";
import { useDashboard } from "../../../context/DashboardContext";
import { toastMessage } from "../../../helpers/AlertMessage";

function Presensi({ kelasIds, filterMatkul = [] }) {
  const { search } = useSearch(); // Mendapatkan input pencarian
  const [presensiData, setPresensiData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Data setelah filter pencarian
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

        // Gunakan Promise.allSettled agar tidak langsung gagal jika ada error pada satu idkelas
        const presensiResults = await Promise.allSettled(
          kelasIds.map(async (idkelas) => {
            try {
              const response = await apiOptions.get(`/presensi/${idkelas}`);
              return response.data;
            } catch (err) {
              throw new Error(
                `Gagal mengambil presensi untuk ID kelas: ${idkelas}`
              );
            }
          })
        );

        // Filter hanya hasil yang sukses
        const successfulData = presensiResults
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value)
          .flat();

        setPresensiData(successfulData);

        // Tampilkan error jika ada request yang gagal
        const errors = presensiResults
          .filter((result) => result.status === "rejected")
          .map((result) => result.reason.message);

        if (errors.length > 0) {
          console.warn("Beberapa data tidak bisa diambil:", errors);
          toastMessage("warn", errors.join("\n"), { position: "top-center" });
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
  }, [kelasIds, toastMessage]);

  // Filter data berdasarkan pencarian dan reset ke halaman pertama
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
    setCurrentPage(1); // Reset pagination ke halaman pertama saat pencarian berubah

    // console.log(filtered);
  }, [search, presensiData, filterMatkul]);

  const handlePageDataChange = (currentData, indexOfFirstItem) => {
    setCurrentData(currentData);
    setIndexFirstItem(indexOfFirstItem);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div
            className={`pbm-table presensi ${
              expandedSidebar === false ? "expanded" : ""
            }`}
          >
            <div className="thead">
              <div className="row">No</div>
              <div className="row">Mata Kuliah</div>
              {/* <div className="row">Kelas</div> */}
              {/* <div className="row">Pengajar</div> */}
              <div className="row">NPM</div>
              <div className="row">Nama Mhs</div>
              {/* <div className="row">Status</div> */}
              <div className="row">Total Pertemuan</div>
              <div className="row">Alfa</div>
              <div className="row">Hadir</div>
              <div className="row">Ijin</div>
              <div className="row">Sakit</div>
              <div className="row">Presentase</div>
            </div>
            {currentData.map((data, index) => (
              <div className="tbody" key={index}>
                <div className="col">{indexFirstItem + index + 1}</div>
                <div className="col">{data.nama_mata_kuliah}</div>
                {/* <div className="col">{data.id_kelas}</div> */}
                {/* <div className="col">
                  {data.namapengajar.replace(/^.*?-/, "")}
                </div> */}
                <div className="col">{data.data.nim}</div>
                <div className="col">{data.data.nama}</div>
                {/* <div className="col">Reguler</div> */}
                <div className="col">{data.data.pertemuan}</div>
                <div className="col">{data.data.alfa}</div>
                <div className="col">{data.data.hadir}</div>
                <div className="col">{data.data.ijin}</div>
                <div className="col">{data.data.sakit}</div>
                <div className="col">
                  {parseFloat(data.data.presentase.toFixed(2))}
                </div>
              </div>
            ))}
          </div>

          <Pagination
            data={filteredData} // Pastikan pagination hanya bekerja dengan hasil pencarian
            itemsPerPage={10}
            onPageDataChange={handlePageDataChange}
            currentPage={currentPage} // Tambahkan prop ini jika Pagination mendukung
            setCurrentPage={setCurrentPage} // Pastikan pagination bisa mengontrol halaman
          />
        </>
      )}
    </>
  );
}

export default Presensi;
