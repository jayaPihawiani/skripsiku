import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthAccessComponent from "./components/AuthAcessComponent";
import KategoriBarangEdit from "./components/KategoriBarangEdit";
import MerkBarangEdit from "./components/MerkBarangEdit";
import SatuanBarangEdit from "./components/SatuanBarangEdit";
import SideBar from "./components/SideBar";
import UserAuthComponent from "./components/UserAuthComponents";
import Barang from "./views/Barang";
import Dashboard from "./views/Dashboard";
import KategoriPage from "./views/KategoriPage";
import Login from "./views/Login";
import LokasiPage from "./views/LokasiPage";
import MerkBarang from "./views/MerkBarang";
import SatuanBarang from "./views/SatuanBarang";

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
                    <Route
                      path="/merk"
                      element={
                        <AuthAccessComponent>
                          <MerkBarang />
                        </AuthAccessComponent>
                      }
                    />
                    <Route
                      path="/merk/edit/:id"
                      element={
                        <AuthAccessComponent>
                          <MerkBarangEdit />
                        </AuthAccessComponent>
                      }
                    />
                    <Route
                      path="/kategori/edit/:id"
                      element={
                        <AuthAccessComponent>
                          <KategoriBarangEdit />
                        </AuthAccessComponent>
                      }
                    />
                    <Route
                      path="/satuan/edit/:id"
                      element={
                        <AuthAccessComponent>
                          <SatuanBarangEdit />
                        </AuthAccessComponent>
                      }
                    />
                    <Route
                      path="/satuan"
                      element={
                        <AuthAccessComponent>
                          <SatuanBarang />
                        </AuthAccessComponent>
                      }
                    />
                    <Route
                      path="/kategori"
                      element={
                        <AuthAccessComponent>
                          <KategoriPage />
                        </AuthAccessComponent>
                      }
                    />
                    <Route
                      path="/lokasi"
                      element={
                        <AuthAccessComponent>
                          <LokasiPage />
                        </AuthAccessComponent>
                      }
                    />
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
