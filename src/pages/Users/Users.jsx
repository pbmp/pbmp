import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Plus, Users, Pencil, Trash } from "lucide-react";
import Layout from "../../components/Layout/Layout";
import image from "../../assets/images/user.png";
import InsertData from "./Crud/Insert";
import UpdateData from "./Crud/Update";
import { useSearch } from "../../helpers/SearchContext";
import Pagination from "../../components/Pagination/Pagination";
import { toastMessage } from "../../helpers/AlertMessage";

function UsersManagement() {
  axios.defaults.withCredentials = true;

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [getData, setGetData] = useState([]);
  const [dataId, setDataId] = useState(null);
  const [currentData, setCurrentData] = useState([]);
  const [indexFirstItem, setIndexFirstItem] = useState(0);
  const [fillData, setFillData] = useState({
    Name: "",
    Email: "",
    Phone: null,
    Alamat: "",
  });

  const { search } = useSearch();

  const getAllData = useCallback(() => {
    axios
      .get("https://msg.ulbi.ac.id/task/recruitment/all")
      .then((res) => {
        if (res.data) {
          setGetData(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    getAllData();
  }, [getAllData]);

  const handleDelete = useCallback((id) => {
    axios
      .delete(`https://msg.ulbi.ac.id/task/recruitment?id=${id}`)
      .then((res) => {
        if (res.data) {
          getAllData();
          toastMessage("success", "Data has been successfully deleted!");
        }
      })
      .catch((err) => {
        toastMessage("error", "Failed to delete data!");
      });
  }, []);

  const handlePageDataChange = (currentData, indexOfFirstItem) => {
    setCurrentData(currentData);
    setIndexFirstItem(indexOfFirstItem);
  };

  return (
    <>
      <Layout>
        <div className="users">
          <div className="users-header">
            <div className="menu">
              <div className="icon">
                <Users strokeWidth={1.5} size={28} />
              </div>
              <div className="title">Users</div>
              <div className="desc">Manage your user</div>
            </div>
            <div
              className="add-user"
              onClick={() => {
                setOpenCreateModal(true);
              }}
            >
              <div className="icon">
                <Plus strokeWidth={2} size={20} />
              </div>
              <div className="text">Add User</div>
            </div>
          </div>
          <div className="users-table">
            <div className="thead">
              <div className="row">No</div>
              <div className="row">User Name</div>
              <div className="row">Phone Number</div>
              <div className="row">Position</div>
              <div className="row">Address</div>
              <div className="row">Action</div>
            </div>
            {currentData
              .filter((item) => {
                const searchLower = search.toLowerCase();
                return (
                  item.name.toLowerCase().includes(searchLower) ||
                  item.email.toLowerCase().includes(searchLower) ||
                  item.phone.toLowerCase().includes(searchLower) ||
                  item.alamat.toLowerCase().includes(searchLower)
                );
              })
              .map((data, index) => (
                <div className="tbody" key={index}>
                  <div className="col">{indexFirstItem + index + 1}</div>
                  <div className="col">
                    <div className="avatar">
                      <img src={image} alt="image-user" />
                    </div>
                    <span className="name">
                      {data.name === "" ? "test" : data.name}
                    </span>
                    <span className="email">
                      {data.email === "" ? "test@gmail.com" : data.email}
                    </span>
                  </div>
                  <div className="col">
                    {data.phone === "" ? "09214115" : data.phone}
                  </div>
                  {data.name === "Muhammad Azka Nuril Islami" ? (
                    <div className="col">Ceo</div>
                  ) : (
                    <div className="col">Employee</div>
                  )}
                  <div className="col">
                    {data.alamat === "" ? "test" : data.alamat}
                  </div>
                  <div className="col">
                    <div
                      className="edit"
                      onClick={() => {
                        setOpenUpdateModal(true);
                        setDataId(data.id);
                      }}
                    >
                      <Pencil className="icon" strokeWidth={2} size={16} />
                    </div>
                    <div
                      className="delete"
                      onClick={() => {
                        handleDelete(data.id);
                      }}
                    >
                      <Trash className="icon" strokeWidth={2} size={16} />
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <Pagination
            data={getData}
            itemsPerPage={5}
            onPageDataChange={handlePageDataChange}
          />
        </div>
        <InsertData
          onOpen={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
          refreshData={getAllData}
        />
        <UpdateData
          onOpen={openUpdateModal}
          onClose={() => setOpenUpdateModal(false)}
          dataId={dataId}
          refreshData={getAllData}
        />
      </Layout>
    </>
  );
}

export default UsersManagement;
