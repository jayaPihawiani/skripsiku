import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/authSlice";
import barangSlice from "../features/barangSlice";
import detailBrg from "../features/detailBarang";

const store = configureStore({
  reducer: {
    auth: authSlice,
    barang: barangSlice,
    detail_barang: detailBrg,
  },
});

export default store;
