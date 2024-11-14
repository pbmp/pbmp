import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Modal from "../../../components/Modal/Modal";
import { validationSchema } from "../../../helpers/ValidationSchema";
import { toastMessage } from "../../../helpers/AlertMessage";

export default function UpdateData({ onOpen, onClose, dataId, refreshData }) {
  axios.defaults.withCredentials = true;

  const [data, setData] = useState({
    Name: "",
    Email: "",
    Phone: null,
    Alamat: "",
  });


  const getDataById = useCallback(() => {
    if (dataId) {
      axios
        .get(`https://msg.ulbi.ac.id/task/recruitment?id=${dataId}`)
        .then((res) => {
          if (res.data) {
            setData({
              Name: res.data.name,
              Email: res.data.email,
              Phone: res.data.phone,
              Alamat: res.data.alamat,
            });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [dataId]);

  useEffect(() => {
    getDataById();
  }, [getDataById]);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      validationSchema
        .validate(data, { abortEarly: false })
        .then(() => {
          axios
            .put(`https://msg.ulbi.ac.id/task/recruitment?id=${dataId}`, data)
            .then((res) => {
              if (res.data) {
                toastMessage("success", "Data has been successfully updated!");
                onClose();
                refreshData();
              }
            })
            .catch((err) => {
              toastMessage("error", "Failed to update data!");
            });
        })
        .catch((errors) => {
          errors.inner.forEach((error) => {
            toastMessage("error", error.message);
          });
        });
    },
    [validationSchema, data, dataId, onClose, refreshData, toastMessage]
  );

  return (
    <>
      <Modal
        titleModal="Update Data"
        onOpen={onOpen}
        onClose={onClose}
        displayMessage={toastMessage}
      >
        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="Name"
            autoComplete="name"
            placeholder="Name"
            onChange={handleChange}
            value={data.Name || ""}
          />
          <input
            type="email"
            name="Email"
            autoComplete="email"
            placeholder="Email"
            onChange={handleChange}
            value={data.Email || ""}
          />
          <input
            type="number"
            name="Phone"
            autoComplete="tel"
            placeholder="Phone"
            onChange={handleChange}
            value={data.Phone || ""}
          />
          <input
            type="text"
            name="Alamat"
            placeholder="Address"
            onChange={handleChange}
            value={data.Alamat || ""}
          />
          <button type="submit">Update</button>
        </form>
      </Modal>
    </>
  );
}
