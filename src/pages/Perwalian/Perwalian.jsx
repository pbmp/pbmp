import React from "react";
import { LayoutDashboard } from "lucide-react";
import Layout from "@/components/Layout/Layout";

function Perwalian() {
  return (
    <>
      <Layout>
        <div className="perwalian">
          <div className="perwalian-header">
            <div className="menu">
              <div className="icon">
                <LayoutDashboard strokeWidth={1.5} size={28} />
              </div>
              <div className="title">Perwalian</div>
              <div className="desc">Overview All Component</div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Perwalian;
