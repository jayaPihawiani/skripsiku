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
import Dashboard from "./views/Dashboard";
import DistribusiPage from "./views/DistribusiPage";
import DivisiPage from "./views/DivisiPage";
import Login from "./views/Login";
import LokasiPage from "./views/LokasiPage";
import Barang from "./views/master_barang/Barang";
import KategoriPage from "./views/master_barang/KategoriPage";
import MerkBarang from "./views/master_barang/MerkBarang";
import SatuanBarang from "./views/master_barang/SatuanBarang";
import PermintaanPage from "./views/PermintaanPage";
import BarangMasuk from "./views/transaksi/BarangMasukPage";
import KerusakanPage from "./views/transaksi/KerusakanPage";
import Pemindahan from "./views/transaksi/PemindahanPage";
import PenghapusanPage from "./views/transaksi/PenghapusanPage";
import UserPage from "./views/UserPage";

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
                      <Route path="/masuk" element={<BarangMasuk />} />
                      <Route path="/pindah" element={<Pemindahan />} />
                      <Route path="/permintaan" element={<PermintaanPage />} />
                      <Route path="/distribusi" element={<DistribusiPage />} />
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
