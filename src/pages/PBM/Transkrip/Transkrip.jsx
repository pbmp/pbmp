import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination/Pagination";
import { apiOptionsNoTimeout } from "../../../helpers/useApiSevima";
import { useSearch } from "@/helpers/SearchContext";
import { useDashboard } from "../../../context/DashboardContext";
import { toastMessage } from "../../../helpers/AlertMessage";

function Transkrip({ kelasIds, filterMatkul = [] }) {
  const { search } = useSearch();
  const [KHSData, setKHSData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [indexFirstItem, setIndexFirstItem] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const { expandedSidebar } = useDashboard();

  useEffect(() => {
    const fetchJurnalData = async () => {
      if (kelasIds.length === 0) return;

      try {
        const [KHSResults, NameResults] = await Promise.all([
          Promise.allSettled(
            kelasIds.map(async (idkelas) => {
              try {
                const result = await apiOptionsNoTimeout.get(
                  `/data/transkrip/${idkelas}`
                );
                return result.data.map((item) => item.attributes);
              } catch (err) {
                throw new Error(
                  `Gagal mengambil data KHS untuk ID kelas: ${idkelas}`
                );
              }
            })
          ),
          Promise.allSettled(
            kelasIds.map(async (idkelas) => {
              try {
                const result = await apiOptionsNoTimeout.get(
                  `/nilai/${idkelas}`
                );
                return result.data.map((item) => ({
                  nim: item.attributes.nim,
                  nama_mahasiswa: item.attributes.nama_mahasiswa,
                }));
              } catch (err) {
                throw new Error(
                  `Gagal mengambil data Nama untuk ID kelas: ${idkelas}`
                );
              }
            })
          ),
        ]);

        // Ambil hanya data yang sukses
        const successfulKHSData = KHSResults.filter(
          (res) => res.status === "fulfilled"
        ).flatMap((res) => res.value);
        const successfulNameData = NameResults.filter(
          (res) => res.status === "fulfilled"
        ).flatMap((res) => res.value);

        // Buat Map untuk menyimpan nama mahasiswa berdasarkan NIM
        const nameMap = new Map(
          successfulNameData.map((data) => [data.nim, data.nama_mahasiswa])
        );

        // Hapus duplikat KHS berdasarkan NIM + Mata Kuliah
        const uniqueKHSData = [
          ...new Map(
            successfulKHSData
              .reverse()
              .map((data) => [`${data.nim}-${data.mata_kuliah}`, data])
          ).values(),
        ];

        // Gabungkan nama mahasiswa dari NameData ke KHSData
        const mergedData = uniqueKHSData.map((khsItem) => ({
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
      }
    };

    fetchJurnalData();
  }, [kelasIds, toastMessage]);

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

  return (
    <>
      <div
        className={`pbm-table transkrip ${
          expandedSidebar === false ? "expanded" : ""
        }`}
      >
        <div className="thead">
          <div className="row">No</div>
          <div className="row">Mata Kuliah</div>
          <div className="row">NPM</div>
          <div className="row">Nama Mhs</div>
          <div className="row">Nilai</div>
          <div className="row">Grade</div>
          <div className="row">Lulus</div>
          <div className="row">Info</div>
        </div>
        {currentData.map((data, index) => (
          <div className="tbody" key={index}>
            <div className="col">{indexFirstItem + index + 1}</div>
            <div className="col">{data.mata_kuliah}</div>
            <div className="col">{data.nim}</div>
            <div className="col">{data.nama_mahasiswa}</div>
            <div className="col">{data.nilai_numerik}</div>
            <div className="col">{data.nilai_huruf}</div>
            <div className="col">
              {data.is_lulus === "1" ? "Lulus" : "Tidak Lulus"}
            </div>
            <div className="col">No Info</div>
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

export default Transkrip;
