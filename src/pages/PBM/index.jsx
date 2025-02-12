import Layout from "@/components/Layout/Layout";
import {
  FileText,
  Printer,
  Filter,
  Square,
  SquareCheckBig,
  LibraryBig,
  ClipboardList,
  UserRoundCheck,
} from "lucide-react";
import HeaderEl from "@/components/HeaderEl/HeaderEl";
import JurnalPerkuliahan from "./JurnalPerkuliahan/JurnalPerkuliahan";
import Presensi from "./Presensi/Presensi";
import Transkrip from "./Transkrip/Transkrip";
import Loader from "@/components/Loader/Loader";
import { usePBM } from "./usePBM";

const submenus = [
  {
    id: 1,
    icon: <LibraryBig className="icon" strokeWidth={2} />,
    text: "Jurnal Perkuliahan",
  },
  {
    id: 2,
    icon: <UserRoundCheck className="icon" strokeWidth={2} />,
    text: "Presensi",
  },
  {
    id: 3,
    icon: <ClipboardList className="icon" strokeWidth={2} />,
    text: "Transkrip",
  },
];

export function PBM() {
  const {
    activeSubmenu,
    kelasIds,
    kelasData,
    periodeData,
    loadingPrint,
    openPeriode,
    setOpenPeriode,
    openFilter,
    setOpenFilter,
    filterMatakuliah,
    setFilterMatakuliah,
    tempFilterMatakuliah,
    setTempFilterMatakuliah,
    filterModal,
    periodeModal,
    isLoadingKelas,
    isErrorKelas,
    handleFilterMatakuliah,
    handlePrint,
    handleActiveSubmenu,
  } = usePBM();

  if (isLoadingKelas) return <Loader />;
  if (isErrorKelas) return <p>Error fetching data</p>;

  return (
    <>
      <Layout>
        <div className="pbm">
          <HeaderEl
            classEl={"pbm"}
            titleEl={"PBM"}
            descEl={"Laporan Kinerja Dosen"}
            Icon={FileText}
          >
            <div className="action">
              <div className="print" onClick={() => setOpenPeriode(true)}>
                <Printer className="icon" strokeWidth={1.75} />
                <div className="text">Print</div>
              </div>
              {openPeriode ? (
                <div className="periode-modal" ref={periodeModal}>
                  {periodeData.map((data, index) => {
                    return (
                      <div
                        className="periode-modal-content"
                        key={index}
                        onClick={() => handlePrint(data)}
                      >
                        {data}
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </HeaderEl>
          {loadingPrint ? null : (
            <>
              <div className="pbm-feature">
                <div className="pbm-feature-submenu">
                  {submenus.map((item) => (
                    <div
                      key={item.id}
                      className={`pbm-feature-submenu-link ${
                        activeSubmenu === item.id ? "active" : ""
                      }`}
                      onClick={() => handleActiveSubmenu(item.id)}
                    >
                      {item.icon}
                      <div className="text">{item.text}</div>
                    </div>
                  ))}
                </div>
                <div className="pbm-feature-filter">
                  <div
                    className="add-filters"
                    onClick={() => setOpenFilter(true)}
                  >
                    <Filter className="icon" strokeWidth={1.75} />
                    <div className="text">Add Filters</div>
                    {openFilter ? (
                      <div className="filter-modal" ref={filterModal}>
                        <div className="filter-modal-content">
                          <div className="filter-by">Matakuliah</div>
                          <div className="filter-list">
                            {kelasData.data.map((item, index) => {
                              const activeFilter =
                                tempFilterMatakuliah?.includes(
                                  item.attributes.id_kelas
                                );

                              return (
                                <div
                                  className={`filter-list-item`}
                                  key={index}
                                  onClick={() =>
                                    handleFilterMatakuliah(
                                      item.attributes.id_kelas
                                    )
                                  }
                                >
                                  {activeFilter ? (
                                    <SquareCheckBig
                                      strokeWidth={1.75}
                                      className="icon"
                                    />
                                  ) : (
                                    <Square
                                      strokeWidth={1.25}
                                      className="icon"
                                    />
                                  )}
                                  <div className="text">
                                    {item.attributes.id_periode} -{" "}
                                    {item.attributes.mata_kuliah}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <div className="filter-modal-button">
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenFilter(false);
                            }}
                          >
                            cancel
                          </span>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              setFilterMatakuliah(tempFilterMatakuliah);
                              setOpenFilter(false);
                            }}
                          >
                            apply
                          </span>
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div
                    className="clear-filter"
                    onClick={() => {
                      setFilterMatakuliah([]);
                      setTempFilterMatakuliah([]);
                    }}
                  >
                    <div className="text">Clear Filter</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        {loadingPrint ? (
          <Loader text="Printing Document on Progress..." />
        ) : (
          <div className="pbm-content">
            {activeSubmenu === 1 && (
              <JurnalPerkuliahan
                kelasIds={kelasIds}
                filterMatkul={filterMatakuliah}
              />
            )}
            {activeSubmenu === 2 && (
              <Presensi kelasIds={kelasIds} filterMatkul={filterMatakuliah} />
            )}
            {activeSubmenu === 3 && (
              <Transkrip kelasIds={kelasIds} filterMatkul={filterMatakuliah} />
            )}
          </div>
        )}
      </Layout>
    </>
  );
}

export default PBM;
