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

export default function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navbar><Dashboard /></Navbar>}></Route>
          <Route path="/Member" element={<Navbar><Member /></Navbar>} />
          <Route path="/Paket" element={<Navbar><Paket /></Navbar>} />
          <Route path="/User" element={<Navbar><User /></Navbar>} />
          <Route path="/Transaksi" element={<Navbar><Transaksi /></Navbar>} />
          <Route path="/FormTransaksi" element={<Navbar><FormTransaksi /></Navbar>} />
          <Route path="/Login" element={<Login />} />
          <Route component={NotFound} />
        </Routes>
    </BrowserRouter>
  )
}
