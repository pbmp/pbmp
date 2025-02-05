import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { Shuffle, DatabaseBackup, RefreshCcw } from "lucide-react";
import Layout from "@/components/Layout/Layout";
import HeaderEl from "@/components/HeaderEl/HeaderEl";
import Loader from "@/components/Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import { apiOptionsNoTimeout } from "../../helpers/useApiSevima";
import { toastMessage } from "../../helpers/AlertMessage";
import { useDashboard } from "../../context/DashboardContext";
import { Navigate, useNavigate } from "react-router-dom";

function SynchGrate() {
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const asyncModal = useRef(null);

  const { user } = useDashboard();
  const navigate = useNavigate();

  useEffect(() => {
    const getIsAdmak = user?.role.find((item) => item.id_role === "admak");

    if (!!getIsAdmak === false) {
      navigate("/pbmp/auth", {
        replace: true,
        state: {
          hasNoAccess: "Access Denied!",
        },
      });
    }
  }, [user]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (asyncModal.current && !asyncModal.current.contains(e.target)) {
        setOpenModal(false);
      }
    };

    if (openModal) {
      document.addEventListener("mousedown", handleOutside);
    } else {
      document.removeEventListener("mousedown", handleOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, [asyncModal, openModal]);

  const handleSyncJurnal = useCallback(async () => {
    setIsLoading(true);

    try {
      const syncPromise = await apiOptionsNoTimeout.get("/jurnalperkuliahan");

      const status = syncPromise.status;

      if (status === 200) {
        toastMessage("success", "Sinkronisasi Selesai!");
      }
      // console.log(syncPromise);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [toastMessage]);

  return (
    <>
      <Layout>
        <div className="synchgrate">
          <HeaderEl
            classEl={"synchgrate"}
            titleEl={"Synchronize"}
            descEl={"Manage synchronize for refresh data"}
            Icon={DatabaseBackup}
          >
            <div className="action">
              <div className="synchronize" onClick={() => setOpenModal(true)}>
                <RefreshCcw className="icon" strokeWidth={2} />
                <div className="text">Synchronize</div>
              </div>
              {openModal ? (
                <div className="synchronize-modal" ref={asyncModal}>
                  <div
                    className="synchronize-modal-content"
                    onClick={handleSyncJurnal}
                  >
                    Jurnal Perkuliahan
                  </div>
                </div>
              ) : null}
              {/* <div className="migrate">
                <Shuffle className="icon" strokeWidth={2} />
                <div className="text">Migrate</div>
              </div> */}
            </div>
          </HeaderEl>
          <div className="synchgrate-content">
            {isLoading && <Loader text="Sinkronisasi..." />}
          </div>
        </div>
      </Layout>
    </>
  );
}

export default SynchGrate;
