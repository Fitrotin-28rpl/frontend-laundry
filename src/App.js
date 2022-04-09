import React from "react";
import NotFound from "./NotFound";
import Member from "./pages/Member";
import Paket from "./pages/Paket";
import User from "./pages/User";
import Transaksi from "./pages/Transaksi";
import FormTransaksi from "./pages/FormTransaksi";
import Login from "./pages/Login";
import Navbar from "./Navbar";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './style.css'


export default function App() {
  return (
    <BrowserRouter className="background">
        <Routes>
          <Route path="/" element={<Dashboard />}></Route>
          <Route path="/Member" element={<Member />} />
          <Route path="/Paket" element={<Paket />} />
          <Route path="/User" element={<User />} />
          <Route path="/Transaksi" element={<Transaksi />} />
          <Route path="/FormTransaksi" element={<FormTransaksi />} />
          <Route path="/Login" element={<Login />} />
          <Route component={NotFound} />
        </Routes>
    </BrowserRouter>
  )
}
