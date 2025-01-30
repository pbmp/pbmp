import React from "react";

function Loader({ text = null }) {
  return (
    /* From Uiverse.io by Nawsome */
    <div className="wrapper-fetch-loader">
      <div className="fetch-loader">
        <div className="fetch-loader__bar"></div>
        <div className="fetch-loader__bar"></div>
        <div className="fetch-loader__bar"></div>
        <div className="fetch-loader__bar"></div>
        <div className="fetch-loader__bar"></div>
        <div className="fetch-loader__ball"></div>
      </div>
      <div className="fecth-text">{text}</div>
    </div>
  );
}

export default Loader;
