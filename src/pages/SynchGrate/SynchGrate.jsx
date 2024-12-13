import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Shuffle, DatabaseBackup, RefreshCcw } from "lucide-react";
import Layout from "@/components/Layout/Layout";
import HeaderEl from "@/components/HeaderEl/HeaderEl";

function SynchGrate() {
  axios.defaults.withCredentials = true;

  return (
    <>
      <Layout>
        <div className="synchgrate">
          <HeaderEl
            classEl={"synchgrate"}
            titleEl={"Synchronize & Migrate"}
            descEl={"Manage synchronize & migrate for update data"}
            Icon={DatabaseBackup}
          >
            <div className="action">
              <div className="synchronize">
                <RefreshCcw className="icon" strokeWidth={2} />
                <div className="text">Synchronize</div>
              </div>
              <div className="migrate">
                <Shuffle className="icon" strokeWidth={2} />
                <div className="text">Migrate</div>
              </div>
            </div>
          </HeaderEl>
        </div>
      </Layout>
    </>
  );
}

export default SynchGrate;
