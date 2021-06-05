import React from "react";

import "./Home.css"
export default function Home() {
  return (
    <React.Fragment>
      <main className="main-wrapper section-center">
        <div className="home-section card-base">
          <div className="home-item__info">
            <h2 className="home-item__title">¿Qué es?</h2>
            <p className="home-item__description">
              Es una aplicación que puedes usar para buscar los mejores huecos
              entre clases para reunirte con tus compañeros o amigos con la
              finalidad de crear un grupo de estudio, charlar entre otras cosas.
            </p>
          </div>

          <div className="home-item__info">
            <h2 className="home-item__title">¿Por qué usarlo?</h2>
            <p className="home-item__description">
              Usando FindYourGap puedes buscar tus huecos de manera más rápida
              que la convencional, además de que encontrarás los mejores, es
              decir aquellos que no se alejen mucho de tus clases.
            </p>
          </div>

          <div className="home-item__info">
            <h2 className="home-item__title">¿Cómo usarlo?</h2>
            <p className="home-item__description">
              Simplemente registrate usando tu usuario uninorte y contraseña, luego ingresa los usuarios uninorte de las
              personas con las que quieres buscar huecos en común y listo escoge
              el que más te guste.
            </p>
          </div>

          <div className="home-item__info">
            <h2 className="home-item__title">Tranquilo</h2>
            <p className="home-item__description">
              FindYourGap no guarda tu contraseña, solo tu usuario uninorte e
              información de cuando tienes clases o no.
            </p>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p className="footer__title">
          Hecho por <a href="https://github.com/DgxProjects29">@InevaUp</a>,
          Horarios provistos por{" "}
          <a href="https://mihorario.herokuapp.com/">mihorario</a>
        </p>
      </footer>
    </React.Fragment>
  );
}
