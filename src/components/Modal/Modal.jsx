import React from "react";
import logo from "./../../assets/logo/logo-Photoroom.png";

function Modal({ titleModal, children, onClose, onOpen }) {
  if (!onOpen) return null;

  return (
    <>
      <div className="overlay-modal" onClick={onClose}>
        <div
          className="modal"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <img src={logo} alt="logo" className="modal-image" />
          <span className="modal-title">{titleModal}</span>
          {children}
        </div>
      </div>
    </>
  );
}

export default Modal;
