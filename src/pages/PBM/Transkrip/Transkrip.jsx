import Pagination from "@/components/Pagination/Pagination";
import Loader from "@/components/Loader/Loader";
import useTranskrip from "./useTranskrip";
import PropTypes from "prop-types";

function Transkrip({ kelasIds, filterMatkul = [] }) {
  const {
    filteredData,
    currentData,
    indexFirstItem,
    currentPage,
    setCurrentPage,
    handlePageDataChange,
    expandedSidebar,
    isLoading,
  } = useTranskrip({ kelasIds, filterMatkul });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
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
      )}
    </>
  );
}

Transkrip.propTypes = {
  kelasIds: PropTypes.array,
  filterMatkul: PropTypes.array,
};

export default Transkrip;
