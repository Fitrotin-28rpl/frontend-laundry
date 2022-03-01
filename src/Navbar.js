import React from "react";
import { Link } from "react-router-dom";

function Logout() {
    // remove data token dan user dari local storage
    localStorage.removeItem("user")
    localStorage.removeItem("token")
}

export default function Navbar(props) {
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    {/* brand */}
                    <a href="/" className="navbar-brand">Londree</a>

                    {/* button toggler */}
                    <button className="navbar-toggler"
                        data-bs-toggle="collapse" data-bs-target="#myNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* define menus */}
                    <div className="collapse navbar-collapse" id="myNav">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link to="/Member" className="nav-link" >
                                    Member
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link to="/User" className="nav-link" >
                                    User
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link to="/Paket" className="nav-link" >
                                    Package
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link to="/Transaksi" className="nav-link" >
                                    Transaction
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link to="/FormTransaksi" className="nav-link" >
                                    New Transaction
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link
                                    to="/Login" className="nav-link"
                                    onClick={() => Logout()} >
                                    Logout
                                </Link>
                            </li>

                        </ul>
                    </div>
                </div>
            </nav>
            {props.children}
        </div>
    )
}