import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/authSlice";
import barangSlice from "../features/barangSlice";
import detailBrg from "../features/detailBarang";
import permintaanSlice from "../features/permintaanSlice";
import userSlice from "../features/UserSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    barang: barangSlice,
    detail_barang: detailBrg,
    user: userSlice,
    permintaan: permintaanSlice,
  },
});

export default store;
