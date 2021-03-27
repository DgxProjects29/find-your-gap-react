import React, { useState, useEffect, useRef, useReducer } from "react";
import { FaPlus, FaFilter, FaTimes } from "react-icons/fa";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { useSnackbar } from "react-simple-snackbar";
import useFetch from "use-http";
import { API_BASE, errorSnackbarOptions } from "../utils/constants";

import "./Find.css";
import "../common-css/ModalBase.css";
import "./AddUserModal.css";
import "./SettingModal.css";
import "./SettingSwitch.css";
import "./SettingSelect.css";

const ACTIONS = {
  ADD_USER: "ADD_USER",
  REMOVE_USER: "REMOVE_USER",
  UPDATE_SETTINGS: "UPDATE_SETTINGS",
  TOGGLE_ADD_USER_MODAL_TO: "TOGGLE_ADD_USER_MODAL_TO",
  TOGGLE_SETTING_MODAL_TO: "TOGGLE_SETTING_MODAL_TO",
};

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
  const [state, dispatch] = useReducer(reducer, defaultState);

  return (
    <>
      <AddUserModal
        isModalOpen={state.isUserModalOpen}
        usernames={state.usernames}
        dispatch={dispatch}
      />
      <SettingModal
        isModalOpen={state.isSettingModalOpen}
        dispatch={dispatch}
        state={state}
      />
      <main className="main-wrapper section-center">
        <UserSection usernames={state.usernames} dispatch={dispatch} />
        <GapSection state={state} dispatch={dispatch}></GapSection>
      </main>
    </>
  );
}

function reducer(state, action) {
  let newUsernames;
  switch (action.type) {
    case ACTIONS.ADD_USER:
      const lowerUsername = action.payload.toLowerCase();
      newUsernames = [...state.usernames, lowerUsername];
      return {
        ...state,
        usernames: newUsernames,
      };
    case ACTIONS.REMOVE_USER:
      newUsernames = state.usernames.filter(
        (currUsername) => currUsername !== action.payload
      );
      return {
        ...state,
        usernames: newUsernames,
      };
    case ACTIONS.UPDATE_SETTINGS:
      return {
        ...state,
        settings: action.payload,
      };
    case ACTIONS.TOGGLE_ADD_USER_MODAL_TO:
      return {
        ...state,
        isUserModalOpen: action.payload,
      };
    case ACTIONS.TOGGLE_SETTING_MODAL_TO:
      return {
        ...state,
        isSettingModalOpen: action.payload,
      };
    default:
      return state;
  }
}

function UserSection({ usernames, dispatch }) {
  return (
    <section className="find-container users-card card-base">
      <h2 className="find-container__title">Usuarios</h2>
      <hr className="primary-solid" />
      <div className="users-container">
        {usernames.map((username) => {
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

function GapSection({ dispatch, state }) {
  const [gapData, setGapData] = useState({});
  // const [isGapDataLoaded, setGapDataLoaded] = useState(false);
  const [openSnackbar] = useSnackbar(errorSnackbarOptions);

  const { post, response, loading } = useFetch(API_BASE);

  const getGapData = async (body) => {
    const newGapData = await post("/results", body);
    if (response.ok) {
      setGapData(newGapData);
      // setGapDataLoaded(true);
    } else {
      if (response.status === 400) {
        openSnackbar(newGapData.usernames[0]);
      } else {
        openSnackbar("Un error inesperado ha ocurrido");
      }
    }
  };

  useEffect(() => {
    console.log("call useEffect   " + state.usernames.length);
    if (state.usernames.length >= 2) {
      const body = {
        usernames: state.usernames,
        compute_sd: state.settings.compute_sd,
      };
      if (state.settings.limit !== "-1") {
        body["limit"] = state.settings.limit;
      }
      console.table(body);
      getGapData(body);
    }
  }, [state.usernames, state.settings]);

  return (
    <section className="find-container gaps-card card-base">
      <h2 className="find-container__title">Huecos en común</h2>
      <hr className="primary-solid" />
      <div className="gaps-container">
        {!loading &&
          gapData?.gaps?.map((gap, index) => {
            if (
              state.settings.day_filter !== -1 ||
              state.settings.day_filter === gap.day
            )
              return (
                <GapItem
                  key={index}
                  gap={gap}
                  showAvgSd={state.settings.show_avg_sd}
                />
              );
          })}
      </div>
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

function ModalHeader({ title, closeModal }) {
  return (
    <header className="modal__header">
      <h2 className="modal__title">{title}</h2>
      <button className="modal__close" aria-label="Close modal">
        <FaTimes className="floating-button--icon" onClick={closeModal} />
      </button>
    </header>
  );
}

function AddUserModal({ isModalOpen, usernames, dispatch }) {
  const userTextInput = useRef(null);

  const { register, handleSubmit, errors, setValue } = useForm();

  const closeModal = () => {
    dispatch({ type: ACTIONS.TOGGLE_ADD_USER_MODAL_TO, payload: false });
  };

  const setFocus = () => {
    userTextInput.current.focus();
  };

  const validateUsername = (username) => {
    const lowerUsername = username.toLowerCase();
    return !usernames.includes(lowerUsername) || "Ya agregaste a este usuario";
  };

  const onSubmit = (data) => {
    setValue("username", "");
    dispatch({ type: ACTIONS.ADD_USER, payload: data.username });
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      onAfterOpen={setFocus}
      id={"modal-add-user-container"}
      contentLabel="Example Modal"
      className="modal__container"
      overlayClassName="modal__overlay"
    >
      <ModalHeader title="Agregar Usuario" closeModal={closeModal} />

      <main className="modal__content" id="modal-add-user-content">
        <form
          className="add-user-form-container"
          id="add-user-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="input-container" style={{ width: "100%" }}>
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              name="username"
              ref={(ref) => {
                userTextInput.current = ref;
                register(ref, {
                  required: "Este campo es requerido",
                  validate: validateUsername,
                });
              }}
            />
            {errors.username && (
              <p className="error-message">{errors.username.message}</p>
            )}
          </div>

          <button
            className="base-btn primary-btn"
            id="add-user-btn"
            type="submit"
          >
            Añadir
          </button>
        </form>
      </main>
    </Modal>
  );
}

function SettingModal({ isModalOpen, dispatch, state }) {
  const { register, getValues, setValue } = useForm();

  const getDataFromSettings = () => {
    const data = getValues();
    // console.log("getting data");
    // console.log(data)
    dispatch({ type: ACTIONS.UPDATE_SETTINGS, payload: data });
  };

  const closeModal = () => {
    dispatch({ type: ACTIONS.TOGGLE_SETTING_MODAL_TO, payload: false });
  };

  const setSettingsValues = () => {
    // console.log("set default values");
    // console.table(state.settings)
    setValue("limit", state.settings.limit);
    setValue("show_avg_sd", state.settings.show_avg_sd);
    setValue("compute_sd", state.settings.compute_sd);
    setValue("day_filter", state.settings.day_filter);
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      onAfterClose={getDataFromSettings}
      onAfterOpen={setSettingsValues}
      id={"modal-settings-container"}
      contentLabel="Example Modal"
      className="modal__container"
      overlayClassName="modal__overlay"
    >
      <ModalHeader title="Configuraciones" closeModal={closeModal} />
      <main className="modal__content" id="modal-setting-content">
        <SettingItemContainer
          title="Limite de Huecos"
          description="Decide cuantos huecos deseas ver, al especificar un limite"
          actionComponent={
            <SettingSelect
              id="limit"
              name="limit"
              register={register}
              options={Array.from({ length: 10 }, (e, i) => i).filter(
                (n) => n >= 2
              )}
              extraOption={
                <option key="-1" value={"-1"}>
                  Sin limites
                </option>
              }
            />
          }
        />

        <SettingItemContainer
          title="Mostrar Avg y Sd"
          description="
          El promedio de cercania con las clases es representado con
          avg, y la inestabilidad entre las clases de los usuarios es
          representado con sd
          "
          actionComponent={
            <SettingSwitch
              id="show_avg_sd"
              name="show_avg_sd"
              register={register}
            />
          }
        />

        <SettingItemContainer
          title="Calcular sd"
          description="
          Clasificar los huecos teniendo en cuenta la variable sd
          "
          actionComponent={
            <SettingSwitch
              id="compute_sd"
              name="compute_sd"
              register={register}
            />
          }
        />

        <SettingItemContainer
          title="Filtrar por dias"
          description="Decide en que dias deseas ver los huecos"
          actionComponent={
            <SettingSelect
              id="day_filter"
              name="day_filter"
              register={register}
              options={["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"]}
              extraOption={
                <option key="-1" value={"-1"}>
                  Sin filtro
                </option>
              }
            />
          }
        />
      </main>
    </Modal>
  );
}

function SettingItemContainer(props) {
  return (
    <div className="setting-item-conatiner">
      <div className="setting-item__info">
        <h2 className="setting-item__title">{props.title}</h2>
        <p className="setting-item__description">{props.description}</p>
      </div>
      <div className="setting-action-container">{props.actionComponent}</div>
    </div>
  );
}

function SettingSwitch({ id, name, register }) {
  return (
    <label className="toggle" htmlFor={name}>
      <input
        className="toggle__input"
        name={name}
        type="checkbox"
        value="true"
        id={id}
        ref={register}
      />
      <div className="toggle__fill"></div>
    </label>
  );
}

function SettingSelect({ id, name, register, options, extraOption }) {
  return (
    <select className="dropbox" name={name} id={id} ref={register}>
      {extraOption}
      {options.map((option, index) => {
        return (
          <option key={index} value={option}>
            {option}
          </option>
        );
      })}
    </select>
  );
}
