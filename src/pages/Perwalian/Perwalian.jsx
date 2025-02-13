import React from "react";
import { LayoutDashboard } from "lucide-react";

function Perwalian() {
  return (
    <>
      <div className="perwalian">
        <div className="perwalian-header">
          <div className="menu">
            <div className="icon">
              <LayoutDashboard strokeWidth={1.25} size={28} />
            </div>
            <div className="title">Perwalian</div>
            <div className="desc">Overview All Component</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Perwalian;
