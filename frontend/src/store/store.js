import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/authSlice";
import barangSlice from "../features/barangSlice";
import detailBrg from "../features/detailBarang";
import invBarangRusak from "../features/barangRusak";

const store = configureStore({
  reducer: {
    auth: authSlice,
    barang: barangSlice,
    detail_barang: detailBrg,
    brg_rusak: invBarangRusak,
  },
});

export default store;
