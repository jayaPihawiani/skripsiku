import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SideBar from "./components/SideBar";
import Barang from "./views/Barang";
import Dashboard from "./views/Dashboard";
import Login from "./views/Login";
import MerkBarang from "./views/MerkBarang";
import SatuanBarang from "./views/SatuanBarang";
import MerkBarangEdit from "./components/MerkBarangEdit";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            <React.Fragment>
              <SideBar>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/barang" element={<Barang />} />
                  <Route path="/merk" element={<MerkBarang />} />
                  <Route path="/merk/edit/:id" element={<MerkBarangEdit />} />
                  <Route path="/satuan" element={<SatuanBarang />} />
                </Routes>
              </SideBar>
            </React.Fragment>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
