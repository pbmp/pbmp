import Pagination from "@/components/Pagination/Pagination";
import Loader from "@/components/Loader/Loader";
import usePresensi from "./usePresensi";
import PropTypes from "prop-types";

function Presensi({ kelasIds, filterMatkul = [] }) {
  const {
    filteredData,
    currentData,
    indexFirstItem,
    currentPage,
    setCurrentPage,
    handlePageDataChange,
    expandedSidebar,
    loading,
  } = usePresensi({ kelasIds, filterMatkul });

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
              <div className="row">NPM</div>
              <div className="row">Nama Mhs</div>
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
                <div className="col">{data.data.nim}</div>
                <div className="col">{data.data.nama}</div>
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

Presensi.propTypes = {
  kelasIds: PropTypes.array,
  filterMatkul: PropTypes.array,
};

export default Presensi;
