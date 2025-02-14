import Pagination from "@/components/Pagination/Pagination";
import { Printer } from "lucide-react";
import { formatDate } from "@/helpers/FormatDate";
import Loader from "@/components/Loader/Loader";
import useJurnalPerkuliahan from "./useJurnalPerkuliahan";
import PropTypes from "prop-types";

function JurnalPerkuliahan({ kelasIds, filterMatkul = [], handlePrint }) {
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
              <div className="row">Total Pertemuan</div>
              <div className="row">Hari / Tanggal</div>
              <div className="row">Periode</div>
              <div className="row">Aksi</div>
            </div>
            {currentData.map((data, index) => (
              <div className="tbody" key={index}>
                <div className="col">{indexFirstItem + index + 1}</div>
                <div className="col">{data.mata_kuliah}</div>
                <div className="col">{data.total_pertemuan}</div>
                <div className="col">{formatDate(data.tanggal)}</div>
                <div className="col">{data.id_periode}</div>
                <div className="col">
                  <div
                    className="print"
                    onClick={() => handlePrint(data.id_kelas, data.id_periode)}
                  >
                    <Printer className="print-icon" strokeWidth={1.5} />
                  </div>
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

JurnalPerkuliahan.propTypes = {
  kelasIds: PropTypes.array,
  filterMatkul: PropTypes.array,
  handlePrint: PropTypes.func,
};

export default JurnalPerkuliahan;
