import React from "react";
import { NavLink } from "react-router-dom";
import { FaTimes, FaHome, FaUserPlus, FaSearch } from "react-icons/fa";

import "./SideBar.css";

export default function SideBar(props) {
  const sidebarClassName = `sidebar__links ${
    props.openSidebar && "sidebar--active"
  }`;

  return (
    <div id="sidebar">
      <div className={sidebarClassName}>
        <a
          className="sidebar-item close-tab-item"
          onClick={props.toggleSidebar}
        >
          <FaTimes className="sidebar-icon"/>
        </a>

        <NavLink
          to="/home"
          className="sidebar-item"
          activeClassName="sidebar-item-active"
        >
          <FaHome className="sidebar-icon"/>
          <p>Home</p>
        </NavLink>

        <NavLink
          to="/register"
          className="sidebar-item"
          activeClassName="sidebar-item-active"
        >
          <FaUserPlus className="sidebar-icon"/>
          <p>Registrarse</p>
        </NavLink>

        <NavLink
          to="/find"
          className="sidebar-item"
          activeClassName="sidebar-item-active"
        >
          <FaSearch className="sidebar-icon"/>
          <p>Buscar</p>
        </NavLink>
      </div>
    </div>
  );
}
