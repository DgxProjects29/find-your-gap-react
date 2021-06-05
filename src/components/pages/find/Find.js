import React, { useState, useEffect, useReducer, useCallback } from "react";
import { FaPlus, FaFilter, FaTimes } from "react-icons/fa";
import useFetch from "use-http";

import "./Find.css";
import "../../common-styles/ModalBase.css";
import "../../common-styles/Loader.css";

import { FindState, useFindState } from "./findState";
import AddUserModal from "./UserModal";
import SettingModal from "./SettingModal";
import { reducer, ACTIONS } from "./reducer";

/* bug in dev, if you reload teh server when saved the file, checkbutton values transform in arrays */

const defaultState = {
  usernames: [],
  settings: {
    compute_sd: false,
    limit: "-1",
    show_avg_sd: false,
    day_filter: "-1",
  },
  isUserModalOpen: false,
  isSettingModalOpen: false,
};

export default function Find() {
  const [findState, dispatch] = useReducer(reducer, defaultState);
  return (
    <FindState.Provider value={{ findState, dispatch }}>
      <AddUserModal />
      <SettingModal />
      <main className="main-wrapper section-find-center">
        <UserSection />
        <GapSection />
      </main>
    </FindState.Provider>
  );
}

function UserSection() {
  const { findState, dispatch } = useFindState();
  return (
    <section className="find-container users-card card-base">
      <h2 className="find-container__title">Usuarios</h2>
      <hr className="primary-solid" />
      <div className="users-container">
        {findState.usernames.map((username) => {
          return (
            <UserItem key={username} username={username} dispatch={dispatch} />
          );
        })}
      </div>
      <button
        id="add-modal-user"
        className="floating-button"
        onClick={() =>
          dispatch({ type: ACTIONS.TOGGLE_ADD_USER_MODAL_TO, payload: true })
        }
      >
        <FaPlus className="floating-button--icon" />
      </button>
    </section>
  );
}

function GapSection() {
  const { findState, dispatch } = useFindState();
  const [gapData, setGapData] = useState({});

  const { post } = useFetch();

  const loadGaps = useCallback(
    async (body) => {
      const newGapData = await post("/results", body);
      setGapData(newGapData);
    },
    [post]
  );

  useEffect(() => {
    if (findState.usernames.length >= 2) {
      const body = {
        usernames: findState.usernames,
        compute_sd: findState.settings.compute_sd,
      };
      if (findState.settings.limit !== "-1") {
        body["limit"] = findState.settings.limit;
      }
      loadGaps(body);
    }
  }, [findState.usernames, findState.settings, loadGaps]);

  return (
    <section className="find-container gaps-card card-base">
      <h2 className="find-container__title">Huecos en común</h2>
      <hr className="primary-solid" />
      <div className="gaps-container">
        {gapData?.gaps
          ?.filter(
            (gap) =>
              findState.settings.day_filter === "-1" ||
              findState.settings.day_filter === gap.day
          )
          ?.map((gap, index) => {
            return (
              <GapItem
                gap={gap}
                showAvgSd={findState.settings.show_avg_sd}
                key={index}
              />
            );
          })}
      </div>
      {gapData?.usernames && (
        <p
          className="error-message"
          style={{ textAlign: "center", padding: "1rem 3.5rem" }}
        >
          {gapData?.usernames.join(",")}
        </p>
      )}
      <button
        id="add-modal-settings"
        className="floating-button"
        onClick={() =>
          dispatch({ type: ACTIONS.TOGGLE_SETTING_MODAL_TO, payload: true })
        }
      >
        <FaFilter className="floating-button--icon" />
      </button>
    </section>
  );
}

//username are uniques
function UserItem({ username, dispatch }) {
  return (
    <div className="user-item">
      <FaTimes
        className="user-item-close-icon"
        onClick={() =>
          dispatch({
            type: ACTIONS.REMOVE_USER,
            payload: username,
          })
        }
      />
      <p>{username}</p>
    </div>
  );
}

function GapItem({ gap, showAvgSd }) {
  return (
    <div className="gap-item">
      <p className="gap-item__title">
        {gap.day} - {gap.hour}
      </p>
      {showAvgSd && (
        <p className="gap-item__extra-info">
          Avg: {gap.avg} - Sd: {gap.sd}
        </p>
      )}
    </div>
  );
}
