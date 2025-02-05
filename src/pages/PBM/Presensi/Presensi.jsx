import React, { useEffect, useState } from "react";
import Pagination from "@/components/Pagination/Pagination";
import { useQuery } from "@tanstack/react-query";
import { useFetchData } from "../../../helpers/useApiSevima";
import { useSearch } from "@/helpers/SearchContext";
import Loader from "@/components/Loader/Loader";
import { useDashboard } from "../../../context/DashboardContext";

function Presensi() {
  const { search } = useSearch(); // Mendapatkan input pencarian
  const [currentPage, setCurrentPage] = useState(1);

  const { user, expandedSidebar } = useDashboard();

  // Menggunakan React Query untuk fetch data
  const { data, isLoading, isError } = useQuery({
    queryKey: [`matakuliah/${user.role[0]?.id_pegawai}`, currentPage],
    queryFn: useFetchData,
    keepPreviousData: true, // Mempertahankan data lama saat ganti halaman
    staleTime: 1000 * 60 * 5, // Cache valid selama 5 menit
  });

  // const handlePageChange = (page) => {
  //   setCurrentPage(page);
  // };

  if (isLoading) return <Loader />;
  if (isError) return <p>Error fetching data</p>;

  const { data: jurnalData, meta } = data;

  return (
    <>
      <div
        className={`pbm-table presensi ${
          expandedSidebar === false ? "expanded" : ""
        }`}
      >
        <div className="thead">
          <div className="row">No</div>
          <div className="row">Mata Kuliah</div>
          <div className="row">Kelas</div>
          <div className="row">Pengajar</div>
          <div className="row">NPM</div>
          <div className="row">Nama Mhs</div>
          <div className="row">Status</div>
          <div className="row">Pertemuan</div>
          <div className="row">Alfa</div>
          <div className="row">Hadir</div>
          <div className="row">Ijin</div>
          <div className="row">Sakit</div>
          <div className="row">Presentase</div>
        </div>
        {jurnalData
          .filter((item) => {
            const searchLowerCase = search.toLowerCase();

            return (
              item.attributes.mata_kuliah
                .toLowerCase()
                .includes(searchLowerCase) ||
              item.attributes.nama_kelas.toLowerCase().includes(searchLowerCase)
            );
          })
          .map((data, index) => (
            <div className="tbody" key={index}>
              <div className="col">
                {meta.per_page * (currentPage - 1) + index + 1}
              </div>
              <div className="col">{data.attributes.mata_kuliah}</div>
              <div className="col">{data.attributes.nama_kelas}</div>
              <div className="col">Indra Riksa Herlambang</div>
              <div className="col">714220000</div>
              <div className="col">Testing Gaming</div>
              <div className="col">Reguler</div>
              <div className="col">16</div>
              <div className="col">1</div>
              <div className="col">15</div>
              <div className="col">1</div>
              <div className="col">2</div>
              <div className="col">Idk%</div>
            </div>
          ))}
      </div>

      {/* Pagination Component */}
      {/* <Pagination
        data={jurnalData}
        itemsPerPage={meta.per_page}
        currentPage={currentPage}
        totalPages={meta.last_page}
        onPageChange={handlePageChange}
      /> */}
    </>
  );
}

export default Presensi;
