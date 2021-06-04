import { useForm } from "react-hook-form";
import { useFindState } from "./findState";
import ModalHeader from "./ModalHeader";
import Modal from "react-modal";

import "./SettingModal.css";
import "./SettingSwitch.css";
import "./SettingSelect.css";
import { ACTIONS } from "./reducer";

export default function SettingModal() {
  const { findState, dispatch } = useFindState();
  const { register, getValues, setValue } = useForm();

  const getDataFromSettings = () => {
    const data = getValues();
    data["show_avg_sd"] = data["show_avg_sd"] === "true";
    data["compute_sd"] = data["compute_sd"] === "true";
    dispatch({ type: ACTIONS.UPDATE_SETTINGS, payload: data });
  };

  const closeModal = () => {
    dispatch({ type: ACTIONS.TOGGLE_SETTING_MODAL_TO, payload: false });
  };

  const setSettingsValues = () => {
    setValue("limit", findState.settings.limit);
    setValue("show_avg_sd", findState.settings.show_avg_sd);
    setValue("compute_sd", findState.settings.compute_sd);
    setValue("day_filter", findState.settings.day_filter);
  };

  return (
    <Modal
      isOpen={findState.isSettingModalOpen}
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
