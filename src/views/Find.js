import React, { useState, useRef } from "react";
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

export default function Find() {
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [isSettingModalOpen, setSettingModalOpen] = useState(false);
  const [openSnackbar] = useSnackbar(errorSnackbarOptions);
  const [usernames, setUsernames] = useState([]);
  const [gapSettings, setGapSettings] = useState({});
  const [gapData, setGapData] = useState({});
  const [isGapDataLoaded, setGapDataLoaded] = useState(false);

  //visit the page of react to use indices as keyus
  const { post, response, loading } = useFetch(API_BASE);

  const removeUser = (username) => {
    let newUsers = usernames.filter(
      (currUsername) => currUsername !== username
    );
    setUsernames(newUsers);
  };

  const validateUser = (username) => {
    const lowerUsername = username.toLowerCase();
    return !usernames.includes(lowerUsername) || "Ya agregaste a este usuario";
  };

  const getGapData = async () => {
    if (usernames.length >= 2 - 1) {
      console.log("start");
      const newGapData = await post("/results", {
        usernames: usernames,
        ...gapSettings,
      });
      if (response.ok) {
        setGapDataLoaded(true);
        setGapData(gapData);
        console.log(gapData);
      } else {
        if (response.status === 400) {
          openSnackbar(newGapData.usernames[0]);
        } else {
          console.log("unexpected");
        }
      }
    }
  };

  const onAddUser = (data) => {
    const lowerUsername = data.username.toLowerCase();
    setUsernames([...usernames, lowerUsername]);
    getGapData();
  };

  return (
    <>
      <AddUserModal
        isModalOpen={isUserModalOpen}
        setModalOpen={setUserModalOpen}
        onAddUser={onAddUser}
        validateUsername={validateUser}
      />
      <SettingModal
        isModalOpen={isSettingModalOpen}
        setModalOpen={setSettingModalOpen}
        setSettings={setGapSettings}
      />

      <main className="main-wrapper section-center">
        <section className="find-container users-card card-base">
          <h2 className="find-container__title">Usuarios</h2>
          <hr className="primary-solid" />
          <div className="users-container">
            {usernames.map((username) => {
              return (
                <UserItem
                  key={username}
                  username={username}
                  removeUser={removeUser}
                />
              );
            })}
          </div>
          <button
            id="add-modal-user"
            className="floating-button"
            onClick={() => setUserModalOpen(true)}
          >
            <FaPlus className="floating-button--icon" />
          </button>
        </section>

        <section className="find-container gaps-card card-base">
          <h2 className="find-container__title">Huecos en común</h2>
          <hr className="primary-solid" />
          <div className="gaps-container">
            {/* {loading &&
              isGapDataLoaded &&
              gapData.gaps.map((gap) => {
                return (
                  <GapItem gap={gap} showAvgSd={gapSettings?.show_avg_sd} />
                );
              })} */}
          </div>
          <button
            id="add-modal-settings"
            className="floating-button"
            onClick={() => setSettingModalOpen(true)}
          >
            <FaFilter className="floating-button--icon" />
          </button>
        </section>
      </main>
    </>
  );
}

//username are uniques
function UserItem({ username, removeUser }) {
  return (
    <div className="user-item">
      <FaTimes
        className="user-item-close-icon"
        onClick={() => removeUser(username)}
      />
      <p>{username}</p>
    </div>
  );
}

function GapItem({ gap, showAvgSd }) {
  return (
    <div class="gap-item">
      <p class="gap-item__title">
        {gap.day} - {gap.hour}
      </p>
      {showAvgSd && (
        <p class="gap-item__extra-info">
          Avg: {gap.avg} - Sd: {gap.sd}
        </p>
      )}
    </div>
  );
}

function ModalHeader({ title, setModalOpen }) {
  return (
    <header className="modal__header">
      <h2 className="modal__title">{title}</h2>
      <button className="modal__close" aria-label="Close modal">
        <FaTimes
          className="floating-button--icon"
          onClick={() => setModalOpen(false)}
        />
      </button>
    </header>
  );
}

function AddUserModal({
  isModalOpen,
  setModalOpen,
  onAddUser,
  validateUsername,
}) {
  const userTextInput = useRef(null);

  const { register, handleSubmit, errors, setValue } = useForm();

  const setFocus = () => {
    userTextInput.current.focus();
  };

  const onSubmit = (data) => {
    setValue("username", "");
    onAddUser(data);
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={() => setModalOpen(false)}
      onAfterOpen={setFocus}
      id={"modal-add-user-container"}
      contentLabel="Example Modal"
      className="modal__container"
      overlayClassName="modal__overlay"
    >
      <ModalHeader title="Agregar Usuario" setModalOpen={setModalOpen} />

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

function SettingModal({ isModalOpen, setModalOpen, setSettings }) {
  const { register, getValues } = useForm();

  const getDataFromSettings = () => {
    const data = getValues();
    setSettings(data);
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={() => setModalOpen(false)}
      onAfterClose={getDataFromSettings}
      id={"modal-settings-container"}
      contentLabel="Example Modal"
      className="modal__container"
      overlayClassName="modal__overlay"
    >
      <ModalHeader title="Configuraciones" setModalOpen={setModalOpen} />

      <main className="modal__content" id="modal-setting-content">
        <SettingItemContainer
          title="Limite de Huecos"
          description="Decide cuantos huecos deseas ver, al especificar un limite"
          actionComponent={
            <SettingSelect
              id="limit"
              name="limit"
              register={register}
              options={Array.from({ length: 20 }, (e, i) => i).filter(
                (n) => n >= 2
              )}
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
        id={id}
        ref={register}
      />
      <div className="toggle__fill"></div>
    </label>
  );
}

function SettingSelect({ id, name, register, options }) {
  return (
    <select className="dropbox" name={name} id={id} ref={register}>
      {options.map((option) => {
        return <option value={option}>{option}</option>;
      })}
    </select>
  );
}
