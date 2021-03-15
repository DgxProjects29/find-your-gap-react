import React from "react";
import { useForm } from "react-hook-form";

import "./Register.css";
import "../common-css/FormStyles.css";

export default function Register() {
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = (data) => console.log(data);

  return (
    <main className="main-wrapper section-center">
      <section className="register-container card-base">
        <h2 className="register-container__title">Registrarse</h2>
        <form
          className="register-form-container"
          onSubmit={handleSubmit(onSubmit)}
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

          <button
            type="submit"
            className="base-btn primary-btn"
            id="register-btn"
          >
            Registrarse
          </button>
        </form>
      </section>
    </main>
  );
}

//{errors.password && <p className="error-message">pass</p>}
