import React, { useEffect, useState } from "react";
import Pagination from "@/components/Pagination/Pagination";
import { useQuery } from "@tanstack/react-query";
import { useFetchData } from "../../../helpers/useApiSevima";
import { useSearch } from "@/helpers/SearchContext";
import Loader from "@/components/Loader/Loader";
import { useDashboard } from "../../../context/DashboardContext";

function Transkrip() {
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) return <Loader />;
  if (isError) return <p>Error fetching data</p>;

  const { data: jurnalData, meta } = data;

  return (
    <>
      <div
        className={`pbm-table transkrip ${
          expandedSidebar === false ? "expanded" : ""
        }`}
      >
        <div className="thead">
          <div className="row">No</div>
          <div className="row">Kode</div>
          <div className="row">Kelas</div>
          <div className="row">Pengajar</div>
          <div className="row">Mata Kuliah</div>
          <div className="row">SKS</div>
          <div className="row">NPM</div>
          <div className="row">Nama Mhs</div>
          <div className="row">Presensi (10%)</div>
          <div className="row">Tugas (20%)</div>
          <div className="row">Asesmen Tengah Semester (35%)</div>
          <div className="row">Asesmen Akhir Semester (35%)</div>
          <div className="row">Nilai</div>
          <div className="row">Grade</div>
          <div className="row">Lulus</div>
          <div className="row">Sunting KRS?</div>
          <div className="row">Info</div>
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
              <div className="col">{data.attributes.kode_mata_kuliah}</div>
              <div className="col">{data.attributes.nama_kelas}</div>
              <div className="col">Indra Riksa Herlambang</div>
              <div className="col">{data.attributes.mata_kuliah}</div>
              <div className="col">3</div>
              <div className="col">714220000</div>
              <div className="col">Testing Gaming</div>
              <div className="col">93.75</div>
              <div className="col">99.00</div>
              <div className="col">75.00</div>
              <div className="col">88.00</div>
              <div className="col">86.85</div>
              <div className="col">A</div>
              <div className="col">Ocee</div>
              <div className="col">Testing</div>
              <div className="col">No Info</div>
            </div>
          ))}
      </div>

      {/* Pagination Component */}
      <Pagination
        data={jurnalData}
        itemsPerPage={meta.per_page}
        currentPage={currentPage}
        totalPages={meta.last_page}
        onPageChange={handlePageChange}
      />
    </>
  );
}

export default Transkrip;
