import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Modal from "../../../components/Modal/Modal";
import { validationSchema } from "../../../helpers/ValidationSchema";
import { toastMessage } from "../../../helpers/AlertMessage";

export default function InsertData({ onOpen, onClose, refreshData }) {
  axios.defaults.withCredentials = true;

  const [data, setData] = useState({
    Name: "",
    Email: "",
    Phone: null,
    Alamat: "",
  });

  useEffect(() => {
    if (onOpen) {
      setData({
        Name: "",
        Email: "",
        Phone: null,
        Alamat: "",
      });
    }
  }, [onOpen]);

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
            .post("https://msg.ulbi.ac.id/task/recruitment", data)
            .then((res) => {
              if (res.data) {
                toastMessage("success", "Data has been successfully added!");
                onClose();
                refreshData();
              }
            })
            .catch((err) => {
              toastMessage("error", "Failed to add data!");
            });
        })
        .catch((errors) => {
          errors.inner.forEach((error) => {
            toastMessage("error", error.message);
          });
        });
    },
    [validationSchema, data, onClose, refreshData, toastMessage]
  );

  return (
    <>
      <Modal titleModal="Insert Data" onOpen={onOpen} onClose={onClose}>
        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            type="text"
            autoComplete="name"
            name="Name"
            placeholder="Name"
            value={data.Name}
            onChange={handleChange}
          />
          <input
            type="text"
            autoComplete="email"
            name="Email"
            placeholder="Email"
            value={data.Email}
            onChange={handleChange}
          />
          <input
            type="number"
            autoComplete="tel"
            name="Phone"
            placeholder="Phone Number"
            value={data.Phone === null ? "" : data.Phone}
            onChange={handleChange}
          />
          <input
            type="text"
            name="Alamat"
            placeholder="Address"
            value={data.Alamat}
            onChange={handleChange}
          />
          <button type="submit">Submit</button>
        </form>
      </Modal>
    </>
  );
}
