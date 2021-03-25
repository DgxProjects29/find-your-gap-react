import React, { useState, useRef } from "react";
import { FaPlus, FaFilter, FaTimes } from "react-icons/fa";
import Modal from "react-modal";

import "./Find.css";
import "../common-css/ModalBase.css";
import "./AddUserModal.css";
import "./SettingModal.css";
import "./SettingSwitch.css";

export default function Find() {
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [isSettingModalOpen, setSettingModalOpen] = useState(false);

  return (
    <>
      <AddUserModal
        isModalOpen={isUserModalOpen}
        setModalOpen={setUserModalOpen}
      />
      <SettingModal
        isModalOpen={isSettingModalOpen}
        setModalOpen={setSettingModalOpen}
      />

      {/* <SettingModal isModalOpen={isModalOpen} setModalOpen={setModalOpen} /> */}
      <main className="main-wrapper section-center">
        <section className="find-container users-card card-base">
          <h2 className="find-container__title">Usuarios</h2>
          <hr className="primary-solid" />
          <div className="users-container"></div>
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
          <div className="gaps-container"></div>
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

function AddUserModal({ isModalOpen, setModalOpen }) {
  const userTextInput = useRef(null);

  const setFocus = () => {
    userTextInput.current.focus();
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
          method="POST"
          action=""
          className="add-user-form-container"
          id="add-user-form"
        >
          <div className="input-container" style={{ width: "100%" }}>
            <label htmlFor="user">Usuario</label>
            <input required type="text" name="user" ref={userTextInput} />
            <p className="error-message"></p>
          </div>

          <button className="base-btn primary-btn" id="add-user-btn">
            Añadir
          </button>
        </form>
      </main>
    </Modal>
  );
}

function SettingModal({ isModalOpen, setModalOpen }) {
  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={() => setModalOpen(false)}
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
            <input
              type="number"
              min="2"
              pattern="\d*"
              name="gap-limit"
              id="gap-limit"
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
          actionComponent={<SettingSwitch id="show-avg-sd" name="show-avg-sd"/>}
        />

        <SettingItemContainer
          title="Calcular sd"
          description="
          Clasificar los huecos teniendo en cuenta la variable sd
          "
          actionComponent={<SettingSwitch id="compute-sd" name="compute-sd"/>}
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

function SettingSwitch({id, name}) {
  return (
    <label className="toggle" htmlFor={name}>
      <input
        className="toggle__input"
        name={name}
        type="checkbox"
        id={id}
      />
      <div className="toggle__fill"></div>
    </label>
  );
}
