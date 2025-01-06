import React, { forwardRef } from "react";
import logo from "./../../../assets/logo/ulbi.jpg";

function Document(props, ref) {
  return (
    <div ref={ref}>
      <div className="sk">
        <div className="sk-header">
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>
          <div className="title">surat keputusan</div>
          <div className="plt-univ">
            plt. rektor universitas logistik dan bisnis internasional
          </div>
          <div className="no">nomor: sk. 130/rek-ulbi/iii/2024</div>
          <div className="about">tentang</div>
          <div className="main">
            penetapan dosen pengampu dan dosen koordinator
          </div>
          <div className="univ">
            universitas logistik dan bisnis internasional
          </div>
          <div className="semester-year">{props.data}</div>
          <div className="mercy">dengan rahmat tuhan yang maha esa</div>
          <div className="plt-univ">
            plt. rektor universitas logistik dan bisnis internasional
          </div>
        </div>
      </div>
    </div>
  );
}

export default forwardRef(Document);
