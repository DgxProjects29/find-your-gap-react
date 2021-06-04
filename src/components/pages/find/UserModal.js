import React, { useRef } from "react";
import { useFindState } from "./findState";
import Modal from "react-modal";
import "./AddUserModal.css";
import ModalHeader from "./ModalHeader";
import { useForm } from "react-hook-form";
import { ACTIONS } from "./reducer";

export default function AddUserModal() {
  const { findState, dispatch } = useFindState();
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
    return (
      !findState.usernames.includes(lowerUsername) ||
      "Ya agregaste a este usuario"
    );
  };

  const onSubmit = (data) => {
    setValue("username", "");
    dispatch({ type: ACTIONS.ADD_USER, payload: data.username });
  };

  return (
    <Modal
      isOpen={findState.isUserModalOpen}
      onRequestClose={closeModal}
      onAfterOpen={setFocus}
      id="modal-add-user-container"
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
