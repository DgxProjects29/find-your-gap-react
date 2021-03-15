import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import SideBar from "./SideBar";

import "./Header.css";

export default function Header() {

  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  };

  return (
    <>
      <SideBar openSidebar={showSidebar} toggleSidebar={toggleSidebar}/>
      <header className="header">
        <div className="header__title">
          <GiHamburgerMenu id="hamburger-tab" 
            onClick={() => toggleSidebar()}
          />
          FindYourGap
        </div>
        <nav className="header__nav">
          <ul className="header__nav-links">
            <li>
              <NavLink to="/home" activeClassName="navlink--active">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/register" activeClassName="navlink--active">
                Registrarse
              </NavLink>
            </li>
            <li>
              <NavLink to="/find" activeClassName="navlink--active">
                Buscar
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
