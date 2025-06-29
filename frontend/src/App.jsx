import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthAccessComponent from "./components/AuthAcessComponent";
import DivisiEdit from "./components/DivisiEditComponent";
import KategoriBarangEdit from "./components/KategoriBarangEdit";
import LokasiEdit from "./components/LokasiEditComponent";
import MerkBarangEdit from "./components/MerkBarangEdit";
import NavBar from "./components/NavBar";
import SatuanBarangEdit from "./components/SatuanBarangEdit";
import SideBar from "./components/SideBar";
import UserAuthComponent from "./components/UserAuthComponents";
import UserEdit from "./components/UserEditComponent";
import { LoadingProvider } from "./context/Loading";
import Barang from "./views/Barang";
import Dashboard from "./views/Dashboard";
import DivisiPage from "./views/DivisiPage";
import KategoriPage from "./views/KategoriPage";
import KerusakanPage from "./views/KerusakanPage";
import Login from "./views/Login";
import LokasiPage from "./views/LokasiPage";
import MerkBarang from "./views/MerkBarang";
import PenghapusanPage from "./views/PenghapusanPage";
import SatuanBarang from "./views/SatuanBarang";
import UserPage from "./views/UserPage";
import BarangMasuk from "./views/BarangMasukPage";

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
                        path="/divisi/edit/:id"
                        element={
                          <AuthAccessComponent>
                            <DivisiEdit />
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
                      <Route
                        path="/lokasi/edit/:id"
                        element={
                          <AuthAccessComponent>
                            <LokasiEdit />
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
                      <Route
                        path="/user/edit/:id"
                        element={
                          <AuthAccessComponent>
                            <UserEdit />
                          </AuthAccessComponent>
                        }
                      />
                      <Route
                        path="/masuk"
                        element={
                          <AuthAccessComponent>
                            <BarangMasuk />
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
