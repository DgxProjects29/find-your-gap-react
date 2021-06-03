import React from "react";

import "./Register.css";
import "../../common-styles/Loader.css";
import "../../common-styles/FormStyles.css";
import { useFormRequest } from "../../../utils/formUtils";
import { successSnackbarOptions } from "../../../utils/constants";
import { useSnackbar } from "react-simple-snackbar";

export default function Register() {

  const [openSnackbar] = useSnackbar(successSnackbarOptions);

  const onSuccess = () => {
    openSnackbar("Registro exitoso")
  };

  const { register, onSubmit, loading, nonFieldErros, errors } = useFormRequest({
    itemPath: "/register",
    onSuccess: onSuccess,
  });

  return (
    <main className="main-wrapper section-center">
      <section className="register-container card-base">
        <h2 className="register-container__title">Registrarse</h2>
        <form
          className="register-form-container"
          onSubmit={onSubmit}
        >
          <div className="input-container">
            <label htmlFor="username">Usuario</label>
            <input
              name="username"
              type="text"
              ref={register({ required: "Este campo es requerido" })}
            />
            {errors.username && (
              <p className="error-message">{errors.username.message}</p>
            )}
          </div>

          <div className="input-container">
            <label htmlFor="password">Contraseña</label>
            <input
              name="password"
              type="password"
              ref={register({ required: "Este campo es requerido" })}
            />
            {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
          </div>

          <div className="input-container">
            <label htmlFor="password_confirmation">Repetir contraseña</label>
            <input
              name="password_confirmation"
              type="password"
              ref={register({ required: "Este campo es requerido" })}
            />
            {errors.password_confirmation && (
              <p className="error-message">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>

          <div className="non-field-error-container">
            {nonFieldErros?.map((errorMessage, index) => (
              <p key={index} className="error-message">{errorMessage}</p>
            ))}
          </div>

          <button
            type="submit"
            className="base-btn primary-btn"
            id="register-btn"
          >
            {loading ? (
              <div className="base-loader login-btn-loader"></div>
            ) : (
              "Registrarse"
            )}
          </button>
        </form>
      </section>
    </main>
  );
}
