import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/authSlice";
import barangSlice from "../features/barangSlice";
import detailBrg from "../features/detailBarang";
import pengajuanSlice from "../features/pengajuanSlice";
import userSlice from "../features/UserSlice";
import penyusutanInventaris from "../features/penyusutanSlice";
import permintaanSlice from "../features/permintaanSlice";
import kategoriRusakSlice from "../features/kategoriRusak";

const store = configureStore({
  reducer: {
    auth: authSlice,
    barang: barangSlice,
    detail_barang: detailBrg,
    user: userSlice,
    pengajuan: pengajuanSlice,
    permintaan: permintaanSlice,
    penyusutan: penyusutanInventaris,
    kategori_rusak: kategoriRusakSlice,
  },
});

export default store;
