import React, { useEffect, useState } from "react";
import Pagination from "@/components/Pagination/Pagination";
import { useQuery } from "@tanstack/react-query";
import { useFetchData, useFetchTemporary } from "../../../helpers/useApiSevima";
import { useSearch } from "@/helpers/SearchContext";
import Loader from "@/components/Loader/Loader";
import { useDashboard } from "../../../context/DashboardContext";
import { formatDate } from "../../../helpers/FormatDate";

function JurnalPerkuliahan() {
  const { search } = useSearch(); // Input pencarian
  const [kelasIds, setKelasIds] = useState([]);
  const [jurnalData, setJurnalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Data setelah filter pencarian
  const [currentData, setCurrentData] = useState([]);
  const [indexFirstItem, setIndexFirstItem] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const { user, expandedSidebar } = useDashboard();

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

  useEffect(() => {
    if (kelasData?.data) {
      const ids = kelasData.data.map((item) => item.attributes.id_kelas);
      setKelasIds(ids);
    }
  }, [kelasData]);

  useEffect(() => {
    const fetchJurnalData = async () => {
      if (kelasIds.length === 0) return;

      try {
        const jurnalResults = await Promise.all(
          kelasIds.map((idkelas) =>
            useFetchTemporary({ queryKey: ["perkuliahan", idkelas] })
          )
        );
        const combinedData = jurnalResults.map((result) => result.data);
        setJurnalData(combinedData.flat());
      } catch (error) {
        console.error("Error fetching jurnal data:", error);
      }
    };

    fetchJurnalData();
  }, [kelasIds]);

  // Filter data berdasarkan pencarian dan reset ke halaman pertama
  useEffect(() => {
    const searchLowerCase = search.toLowerCase();
    const filtered = jurnalData.filter(
      (item) =>
        item.attributes.mata_kuliah.toLowerCase().includes(searchLowerCase) ||
        item.attributes.nama_kelas.toLowerCase().includes(searchLowerCase) ||
        item.attributes.nomor_pertemuan
          .toLowerCase()
          .includes(searchLowerCase) ||
        formatDate(item.attributes.tanggal)
          .toLowerCase()
          .includes(searchLowerCase) ||
        item.attributes.waktu_mulai.toLowerCase().includes(searchLowerCase) ||
        item.attributes.waktu_selesai.toLowerCase().includes(searchLowerCase) ||
        item.attributes.nama_ruang.toLowerCase().includes(searchLowerCase) ||
        item.attributes.status_perkuliahan
          .toLowerCase()
          .includes(searchLowerCase) ||
        item.attributes.rencana_materi
          .toLowerCase()
          .includes(searchLowerCase) ||
        item.attributes.bahasan.toLowerCase().includes(searchLowerCase) ||
        item.attributes.nama_pengisi_materi
          .toLowerCase()
          .includes(searchLowerCase) ||
        item.attributes.sks.toLowerCase().includes(searchLowerCase)
    );

    setFilteredData(filtered);
    setCurrentPage(1); // Reset pagination ke halaman pertama saat pencarian berubah
  }, [search, jurnalData]);

  const handlePageDataChange = (currentData, indexOfFirstItem) => {
    setCurrentData(currentData);
    setIndexFirstItem(indexOfFirstItem);
  };

  if (isLoadingKelas) return <Loader />;
  if (isErrorKelas) return <p>Error fetching data</p>;

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
          <div className="row">Kelas</div>
          <div className="row">Tatap Muka Ke</div>
          <div className="row">Hari / Tanggal</div>
          <div className="row">Mulai</div>
          <div className="row">Selesai</div>
          <div className="row">Ruangan</div>
          <div className="row">Status</div>
          <div className="row">Rencana Materi</div>
          <div className="row">Realisasi Materi</div>
          <div className="row">Kehadiran Mhs</div>
          <div className="row">Pengajar</div>
          <div className="row">sks</div>
          <div className="row">Tanda Tangan</div>
        </div>
        {currentData.map((data, index) => (
          <div className="tbody" key={index}>
            <div className="col">{indexFirstItem + index + 1}</div>
            <div className="col">{data.attributes.mata_kuliah}</div>
            <div className="col">{data.attributes.nama_kelas}</div>
            <div className="col">{data.attributes.nomor_pertemuan}</div>
            <div className="col">{formatDate(data.attributes.tanggal)}</div>
            <div className="col">{data.attributes.waktu_mulai}</div>
            <div className="col">{data.attributes.waktu_selesai}</div>
            <div className="col">{data.attributes.nama_ruang}</div>
            <div className="col">{data.attributes.status_perkuliahan}</div>
            <div className="col">{data.attributes.rencana_materi}</div>
            <div className="col">{data.attributes.bahasan}</div>
            <div className="col">(17/17)</div>
            <div className="col">{data.attributes.nama_pengisi_materi}</div>
            <div className="col">{data.attributes.sks}</div>
            <div className="col"></div>
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
  );
}

export default JurnalPerkuliahan;
