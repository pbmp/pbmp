import React, { useState, useEffect } from "react";
import Pagination from "@/components/Pagination/Pagination";
import axios from "axios";
import { useSearch } from "@/context/SearchContext";
import Endpoints from "@/helpers/Endpoints";
import { Pencil, Trash } from "lucide-react";

function JurnalPerkuliahan() {
  axios.defaults.withCredentials = true;

  const [allData, setAllData] = useState([]); // Semua data tanpa filter
  const [filteredData, setFilteredData] = useState([]); // Data setelah pencarian
  const [currentData, setCurrentData] = useState([]); // Data untuk halaman saat ini
  const [indexFirstItem, setIndexFirstItem] = useState(0);

  const { search } = useSearch();

  const handlePageDataChange = (currentData, indexOfFirstItem) => {
    setCurrentData(currentData);
    setIndexFirstItem(indexOfFirstItem);
  };

  // Fetch data
  useEffect(() => {
    axios
      .get(Endpoints.JurnalPerkuliahan)
      .then((res) => {
        if (res.data.success) {
          const attributes = res.data.data
            .filter((item) => item.attributes)
            .map((item) => item.attributes);
          setAllData(attributes);
          setFilteredData(attributes); // Default saat pertama kali
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // Update filtered data ketika pencarian berubah
  useEffect(() => {
    const searchLower = search.toLowerCase();
    const filtered = allData.filter((item) => {
      return (
        item.kode.toLowerCase().includes(searchLower) ||
        item.nama.toLowerCase().includes(searchLower) ||
        item.program_studi.toLowerCase().includes(searchLower) ||
        item.sks.toLowerCase().includes(searchLower)
      );
    });
    setFilteredData(filtered);
  }, [search, allData]);

  return (
    <>
      <div className="pbm-table">
        <div className="thead">
          <div className="row">No</div>
          <div className="row">Kode mata kuliah</div>
          <div className="row">Nama mata kuliah</div>
          <div className="row">Program Studi</div>
          <div className="row">SKS</div>
          <div className="row">Action</div>
        </div>
        {currentData.map((data, index) => (
          <div className="tbody" key={index}>
            <div className="col">{indexFirstItem + index + 1}</div>
            <div className="col">{data.kode}</div>
            <div className="col">{data.nama}</div>
            <div className="col">{data.program_studi}</div>
            <div className="col">{data.sks}</div>
            <div className="col">
              <div className="edit">
                <Pencil className="icon" strokeWidth={2} size={16} />
              </div>
              <div className="delete">
                <Trash className="icon" strokeWidth={2} size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        data={filteredData} // Kirimkan data hasil pencarian ke Pagination
        itemsPerPage={12}
        onPageDataChange={handlePageDataChange}
      />
    </>
  );
}

export default JurnalPerkuliahan;
