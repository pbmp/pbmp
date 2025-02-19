import { Printer } from "lucide-react";
import PropTypes from "prop-types";

import Pagination from "@/components/Pagination/Pagination";
import Loader from "@/components/Loader/Loader";
import EmptyData from "@/components/EmptyData/EmptyData";
import { formatDate } from "@/helpers/FormatDate";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import useJurnalPerkuliahan from "./useJurnalPerkuliahan";

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

  const windowWidth = useWindowWidth();

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
              <div className="row">Kelas</div>
              {windowWidth > 767.98 ? (
                <>
                  <div className="row">Total Pertemuan</div>
                  <div className="row">Hari / Tanggal</div>
                </>
              ) : null}
              <div className="row">Periode</div>
              <div className="row">Aksi</div>
            </div>
            <EmptyData data={filteredData} />
            {currentData.map((data, index) => {
              const kelas =
                data.semester_mata_kuliah === "1" ||
                data.semester_mata_kuliah === "2"
                  ? "1"
                  : data.semester_mata_kuliah === "3" ||
                    data.semester_mata_kuliah === "4"
                  ? "2"
                  : data.semester_mata_kuliah === "5" ||
                    data.semester_mata_kuliah === "6"
                  ? "3"
                  : data.semester_mata_kuliah === "7" ||
                    data.semester_mata_kuliah === "8"
                  ? "4"
                  : null;

              return (
                <>
                  <div className="tbody" key={index}>
                    <div className="col">{indexFirstItem + index + 1}</div>
                    <div className="col">{data.mata_kuliah}</div>
                    <div className="col">
                      {kelas + data.id_kelas_perkuliahan}
                    </div>
                    {windowWidth > 767.98 ? (
                      <>
                        <div className="col">{data.total_pertemuan}</div>
                        <div className="col">{formatDate(data.tanggal)}</div>
                      </>
                    ) : null}
                    <div className="col">{data.id_periode}</div>
                    <div className="col">
                      <div
                        className="print"
                        onClick={() =>
                          handlePrint(data.id_kelas, data.id_periode)
                        }
                      >
                        <Printer className="print-icon" strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
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
