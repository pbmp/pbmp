import {
  FileText,
  // Printer,
  Square,
  SquareCheckBig,
  LibraryBig,
  // ClipboardList,
  // UserRoundCheck,
} from "lucide-react";
import Header from "@/components/Header/Header";
import Feature from "@/components/Feature/Feature";
import Loader from "@/components/Loader/Loader";
import JurnalPerkuliahan from "./JurnalPerkuliahan/JurnalPerkuliahan";
// import Presensi from "./Presensi/Presensi";
// import Transkrip from "./Transkrip/Transkrip";
import { usePBM } from "./usePBM";

const submenus = [
  {
    id: 1,
    icon: <LibraryBig className="icon" strokeWidth={2} />,
    text: "Laporan Mata Kuliah",
  },
  // {
  //   id: 2,
  //   icon: <UserRoundCheck className="icon" strokeWidth={2} />,
  //   text: "Presensi",
  // },
  // {
  //   id: 3,
  //   icon: <ClipboardList className="icon" strokeWidth={2} />,
  //   text: "Transkrip",
  // },
];

function PBM() {
  const {
    activeSubmenu,
    setActiveSubmenu,
    kelasIds,
    kelasData,
    // periodeData,
    loadingPrint,
    // openPeriode,
    // setOpenPeriode,
    filterMatakuliah,
    setFilterMatakuliah,
    tempFilterMatakuliah,
    setTempFilterMatakuliah,
    // periodeModal,
    isLoadingKelas,
    isErrorKelas,
    handleFilterMatakuliah,
    handlePrint,
  } = usePBM();

  if (isLoadingKelas) return <Loader />;
  if (isErrorKelas) return <p>Error fetching data</p>;

  return (
    <>
      <div className="pbm">
        <Header
          classEl={"pbm"}
          titleEl={"PBM"}
          descEl={"Laporan Kinerja Dosen"}
          Icon={FileText}
        >
          {/* <div className="action">
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
          </div> */}
        </Header>
        {loadingPrint ? null : (
          <Feature
            classEl="pbm"
            submenus={submenus}
            activeSubmenu={activeSubmenu}
            setActiveSubmenu={setActiveSubmenu}
            onApplyFilter={() => {
              setFilterMatakuliah(tempFilterMatakuliah);
            }}
            onClearFilter={() => {
              setFilterMatakuliah([]);
              setTempFilterMatakuliah([]);
            }}
          >
            <div className="filter-modal-content">
              <div className="filter-by">Matakuliah</div>
              <div className="filter-list">
                {kelasData.data.map((item, index) => {
                  const activeFilter = tempFilterMatakuliah?.includes(
                    item.attributes.id_kelas
                  );

                  return (
                    <div
                      className={`filter-list-item`}
                      key={index}
                      onClick={() =>
                        handleFilterMatakuliah(item.attributes.id_kelas)
                      }
                    >
                      {activeFilter ? (
                        <SquareCheckBig strokeWidth={1.75} className="icon" />
                      ) : (
                        <Square strokeWidth={1.25} className="icon" />
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
          </Feature>
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
              handlePrint={handlePrint}
            />
          )}
          {/* {activeSubmenu === 2 && (
            <Presensi kelasIds={kelasIds} filterMatkul={filterMatakuliah} />
          )}
          {activeSubmenu === 3 && (
            <Transkrip kelasIds={kelasIds} filterMatkul={filterMatakuliah} />
          )} */}
        </div>
      )}
    </>
  );
}

export default PBM;
