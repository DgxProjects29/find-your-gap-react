import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useFetch from "use-http";

import "./Register.css";
import "../../common-styles/Loader.css";
import "../../common-styles/FormStyles.css";

export default function Register() {
  const { register, handleSubmit, errors } = useForm();
  const [isDataLoaded, setDataLoaded] = useState(false);
  const [regiserData, setRegisterData] = useState({});
  const { post, response, loading } = useFetch();

  const onSubmit = async (data) => {
    const registerData = await post("/register", {
      username: data.username,
      password: data.password,
      password_confirmation: data.password_confirmation,
    });
    setDataLoaded(true);
    setRegisterData(registerData);
    if (response.ok) {
      console.log("GOOD   " + response.status);
    } else {
      console.log("NOGOOD  " + response.status);
    }
  };

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
            {!loading && isDataLoaded && regiserData.username &&  (
              <p className="error-message">{regiserData.username[0]}</p>
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
            {!loading && isDataLoaded && regiserData.non_field_errors && 
              regiserData.non_field_errors.map((errorMessage) => (
                <p className="error-message">{errorMessage}</p>
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