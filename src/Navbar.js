import userEvent from "@testing-library/user-event";
import React from "react";
import { Link, NavLink } from "react-router-dom";

function Logout() {
  // remove data token dan user dari local storage
  localStorage.removeItem("user");
  localStorage.removeItem("token");
}

export default function Navbar(props) {
  let user = JSON.parse(localStorage.getItem("user"))
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light pt-2">
        <div className="container-fluid mt-3">
          {/* brand */}
          <a href="/" className="navbar-brand">
            <i class="fa-solid fa-rocket" id="logo"></i>
            RELLO
          </a>

          {/* button toggler */}
          <button
            className="navbar-toggler"
            data-bs-toggle="collapse"
            data-bs-target="#myNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* define menus */}
          <div className="collapse navbar-collapse" id="myNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink to="/Member" className="nav-link">
                  Member
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/User" className="nav-link">
                  Petugas
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/Paket" className="nav-link">
                  Paket
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/Transaksi" className="nav-link">
                  Transaksi
                </NavLink>
              </li>
            </ul>

            <div className="d-grid gap-2 d-md-flex justify-content-md-end text-dark pt-2 px-4">
              <h5 className="user-name mt-2">
                Hi, {user.role}
              </h5>
              <NavLink
                className="nav-link text-dark"
                to="/Login"
                onClick={() => Logout()}
              >
                <i class="fa-solid fa-right-from-bracket mx-2"></i>
                Log Out{" "}
              </NavLink>
            </div>
          </div>
        </div>
      </nav>
      {props.children}
    </div>
  );
}
