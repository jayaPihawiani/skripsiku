import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthAccessComponent from "./components/AuthAcessComponent";
import KategoriBarangEdit from "./components/KategoriBarangEdit";
import MerkBarangEdit from "./components/MerkBarangEdit";
import SatuanBarangEdit from "./components/SatuanBarangEdit";
import SideBar from "./components/SideBar";
import UserAuthComponent from "./components/UserAuthComponents";
import { LoadingProvider } from "./context/Loading";
import Barang from "./views/Barang";
import Dashboard from "./views/Dashboard";
import KategoriPage from "./views/KategoriPage";
import KerusakanPage from "./views/KerusakanPage";
import Login from "./views/Login";
import LokasiPage from "./views/LokasiPage";
import MerkBarang from "./views/MerkBarang";
import PenghapusanPage from "./views/PenghapusanPage";
import SatuanBarang from "./views/SatuanBarang";
import NavBar from "./components/NavBar";
import UserPage from "./views/UserPage";
import DivisiPage from "./views/DivisiPage";

function App() {
  return (
    <BrowserRouter>
      <LoadingProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="*"
            element={
              <React.Fragment>
                <NavBar />
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
                      <Route path="/kerusakan" element={<KerusakanPage />} />
                      <Route
                        path="/penghapusan"
                        element={
                          <AuthAccessComponent>
                            <PenghapusanPage />
                          </AuthAccessComponent>
                        }
                      />
                      <Route
                        path="/divisi"
                        element={
                          <AuthAccessComponent>
                            <DivisiPage />
                          </AuthAccessComponent>
                        }
                      />
                      <Route
                        path="/user"
                        element={
                          <AuthAccessComponent>
                            <UserPage />
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
      </LoadingProvider>
    </BrowserRouter>
  );
}

export default App;
