import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthAccessComponent from "./components/AuthAcessComponent";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import UserAuthComponent from "./components/UserAuthComponents";
import UserEdit from "./components/UserEditComponent";
import { LoadingProvider } from "./context/Loading";
import Dashboard from "./views/Dashboard";
import DetailBarang from "./views/DetailBarang";
import DetailEkonomis from "./views/DetailEkonomis";
import DistribusiPage from "./views/DistribusiPage";
import KategoriKerusakanPage from "./views/KategoriKerusakanPage";
import Login from "./views/Login";
import LokasiPage from "./views/LokasiPage";
import Barang from "./views/master_barang/Barang";
import KategoriPage from "./views/master_barang/KategoriPage";
import MerkBarang from "./views/master_barang/MerkBarang";
import PengajuanPage from "./views/PengajuanPage";
import PerbaikanPage from "./views/PerbaikanPage";
import PermintaanPage from "./views/PermintaanPage";
import KerusakanPage from "./views/transaksi/KerusakanPage";
import Pemindahan from "./views/transaksi/PemindahanPage";
import PenghapusanPage from "./views/transaksi/PenghapusanPage";
import UmurEkonomis from "./views/UmurEkonomis";
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
                      <Route path="/unit_barang" element={<DetailBarang />} />
                      <Route
                        path="/merk"
                        element={
                          <AuthAccessComponent>
                            <MerkBarang />
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
                        path="/pindah"
                        element={
                          <AuthAccessComponent>
                            <Pemindahan />
                          </AuthAccessComponent>
                        }
                      />
                      <Route path="/pengajuan" element={<PengajuanPage />} />
                      <Route path="/permintaan" element={<PermintaanPage />} />
                      <Route path="/distribusi" element={<DistribusiPage />} />
                      <Route
                        path="/ekonomis"
                        element={
                          <AuthAccessComponent>
                            <UmurEkonomis />
                          </AuthAccessComponent>
                        }
                      />
                      <Route
                        path="/perbaikan"
                        element={
                          <AuthAccessComponent>
                            <PerbaikanPage />
                          </AuthAccessComponent>
                        }
                      />
                      <Route
                        path="ekonomis/detail_masa_ekonomis"
                        element={
                          <AuthAccessComponent>
                            <DetailEkonomis />
                          </AuthAccessComponent>
                        }
                      />
                      <Route
                        path="/k/kerusakan"
                        element={
                          <AuthAccessComponent>
                            <KategoriKerusakanPage />
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
