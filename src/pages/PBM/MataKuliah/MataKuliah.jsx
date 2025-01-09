import React, { useState } from "react";
import Pagination from "@/components/Pagination/Pagination";
import { useQuery } from "@tanstack/react-query";
import { useFetchData } from "../../../helpers/useApiSevima";
import { useSearch } from "@/helpers/SearchContext";
import Loader from "@/components/Loader/Loader";
import { useDashboard } from "../../../context/DashboardContext";

function MataKuliah() {
  const { search } = useSearch(); // Mendapatkan input pencarian
  const [currentPage, setCurrentPage] = useState(1);

  const { user } = useDashboard();

  // Menggunakan React Query untuk fetch data
  const { data, isLoading, isError } = useQuery({
    queryKey: [`matakuliah/${user.role[0]?.id_pegawai}`, currentPage, search],
    queryFn: useFetchData,
    keepPreviousData: true, // Mempertahankan data lama saat ganti halaman
    staleTime: 1000 * 60 * 5, // Cache valid selama 5 menit
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) return <Loader />;
  if (isError) return <p>Error fetching data</p>;

  const { data: mataKuliahData, meta } = data;

  return (
    <>
      <div className="pbm-table mata-kuliah">
        <div className="thead">
          <div className="row">No</div>
          <div className="row">Kode</div>
          <div className="row">Nama mata kuliah</div>
          <div className="row">Program Studi</div>
          <div className="row">Ruangan</div>
          <div className="row">Periode</div>
          <div className="row">Kurikulum</div>
        </div>
        {mataKuliahData.map((data, index) => (
          <div className="tbody" key={index}>
            <div className="col">
              {meta.per_page * (currentPage - 1) + index + 1}
            </div>
            <div className="col">{data.attributes.kode_mata_kuliah}</div>
            <div className="col">{data.attributes.mata_kuliah}</div>
            <div className="col">{data.attributes.program_studi}</div>
            <div className="col">{data.attributes.nama_ruang}</div>
            <div className="col">{data.attributes.id_periode}</div>
            <div className="col">{data.attributes.id_kurikulum}</div>
          </div>
        ))}
      </div>

      {/* Pagination Component */}
      <Pagination
        data={mataKuliahData}
        itemsPerPage={meta.per_page}
        currentPage={currentPage}
        totalPages={meta.last_page}
        onPageChange={handlePageChange}
      />
    </>
  );
}

export default MataKuliah;
