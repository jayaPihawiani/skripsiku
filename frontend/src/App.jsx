import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import KategoriBarangEdit from "./components/KategoriBarangEdit";
import MerkBarangEdit from "./components/MerkBarangEdit";
import SatuanBarangEdit from "./components/SatuanBarangEdit";
import SideBar from "./components/SideBar";
import UserAuthComponent from "./components/UserAuthComponents";
import Barang from "./views/Barang";
import Dashboard from "./views/Dashboard";
import KategoriPage from "./views/KategoriPage";
import Login from "./views/Login";
import MerkBarang from "./views/MerkBarang";
import SatuanBarang from "./views/SatuanBarang";
import LokasiPage from "./views/LokasiPage";

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
                <UserAuthComponent>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/barang" element={<Barang />} />
                    <Route path="/merk" element={<MerkBarang />} />
                    <Route path="/merk/edit/:id" element={<MerkBarangEdit />} />
                    <Route
                      path="/kategori/edit/:id"
                      element={<KategoriBarangEdit />}
                    />
                    <Route
                      path="/satuan/edit/:id"
                      element={<SatuanBarangEdit />}
                    />
                    <Route path="/satuan" element={<SatuanBarang />} />
                    <Route path="/kategori" element={<KategoriPage />} />
                    <Route path="/lokasi" element={<LokasiPage />} />
                  </Routes>
                </UserAuthComponent>
              </SideBar>
            </React.Fragment>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
