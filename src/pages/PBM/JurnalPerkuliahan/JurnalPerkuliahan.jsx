import Pagination from "@/components/Pagination/Pagination";
import { formatDate } from "@/helpers/FormatDate";
import Loader from "@/components/Loader/Loader";
import useJurnalPerkuliahan from "./useJurnalPerkuliahan";
import PropTypes from "prop-types";

function JurnalPerkuliahan({ kelasIds, filterMatkul = [] }) {
  const {
    filteredData,
    currentData,
    indexFirstItem,
    currentPage,
    setCurrentPage,
    handlePageDataChange,
    expandedSidebar,
    isLoading,
  } = useJurnalPerkuliahan({ kelasIds, filterMatkul });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div
            className={`pbm-table jurnal-perkuliahan ${
              expandedSidebar === false ? "expanded" : ""
            }`}
          >
            <div className="thead">
              <div className="row">No</div>
              <div className="row">Mata Kuliah</div>
              <div className="row">Pertemuan</div>
              <div className="row">Hari / Tanggal</div>
              <div className="row">Rencana Materi</div>
              <div className="row">Realisasi Materi</div>
            </div>
            {currentData.map((data, index) => (
              <div className="tbody" key={index}>
                <div className="col">{indexFirstItem + index + 1}</div>
                <div className="col">{data.mata_kuliah}</div>
                <div className="col">{data.nomor_pertemuan}</div>
                <div className="col">{formatDate(data.tanggal)}</div>
                <div className="col">{data.rencana_materi}</div>
                <div className="col">{data.bahasan}</div>
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
      )}
    </>
  );
}

JurnalPerkuliahan.propTypes = {
  kelasIds: PropTypes.array,
  filterMatkul: PropTypes.array,
};

export default JurnalPerkuliahan;
