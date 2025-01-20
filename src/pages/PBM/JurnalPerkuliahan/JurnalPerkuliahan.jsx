import React, { useEffect, useState } from "react";
import Pagination from "@/components/Pagination/Pagination";
import { useQuery } from "@tanstack/react-query";
import { useFetchData } from "../../../helpers/useApiSevima";
import { useSearch } from "@/helpers/SearchContext";
import Loader from "@/components/Loader/Loader";
import { useDashboard } from "../../../context/DashboardContext";

function JurnalPerkuliahan() {
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
        {jurnalData
          .filter((item) => {
            const searchLowerCase = search.toLowerCase();

            return (
              item.attributes.jam_mulai
                .toLowerCase()
                .includes(searchLowerCase) ||
              item.attributes.jam_selesai
                .toLowerCase()
                .includes(searchLowerCase) ||
              item.attributes.mata_kuliah
                .toLowerCase()
                .includes(searchLowerCase) ||
              item.attributes.nama_kelas
                .toLowerCase()
                .includes(searchLowerCase) ||
              item.attributes.nama_ruang.toLowerCase().includes(searchLowerCase)
            );
          })
          .map((data, index) => (
            <div className="tbody" key={index}>
              <div className="col">{index + 1}</div>
              <div className="col">{data.attributes.mata_kuliah}</div>
              <div className="col">{data.attributes.nama_kelas}</div>
              <div className="col">
                {meta.per_page * (currentPage - 1) + index + 1}
              </div>
              <div className="col">Selasa, 29 Desember 2024</div>
              <div className="col">{data.attributes.jam_mulai}</div>
              <div className="col">{data.attributes.jam_selesai}</div>
              <div className="col">{data.attributes.nama_ruang}</div>
              <div className="col">Selesai</div>
              <div className="col">Lorem ipsum dolor sit amet consectetur.</div>
              <div className="col">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Praesentium, quaerat quo eaque laboriosam autem impedit nobis
                accusantium earum tenetur amet.
              </div>
              <div className="col">(17/17)</div>
              <div className="col">Indra Riksa Herlambang</div>
              <div className="col">3</div>
              <div className="col">Testing</div>
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

export default JurnalPerkuliahan;
