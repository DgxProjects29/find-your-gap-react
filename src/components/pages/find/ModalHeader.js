import { FaTimes } from "react-icons/fa";

export default function ModalHeader({ title, closeModal }) {
  return (
    <header className="modal__header">
      <h2 className="modal__title">{title}</h2>
      <button className="modal__close" aria-label="Close modal">
        <FaTimes className="floating-button--icon" onClick={closeModal} />
      </button>
    </header>
  );
}
