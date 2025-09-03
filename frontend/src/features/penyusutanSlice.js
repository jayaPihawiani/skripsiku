import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const url = import.meta.env.VITE_API_URL;

const initState = {
  penyusutan_barang: {
    data: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    errMessage: false,
  },
  penyusutan_barang_pindah: {
    data: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    errMessage: false,
  },
};

export const updatePenyusutanBarang = createAsyncThunk(
  "penyusutan/updatePenyusutanBarang",
  async (_, thunkApi) => {
    try {
      const response = await axios.patch(`${url}/barang/update`);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error(error.response);

        const errMessage = error.response.data.msg;
        return thunkApi.rejectWithValue(errMessage);
      }
    }
  }
);

export const updatePenyusutanBrgPindah = createAsyncThunk(
  "penyusutan/updatePenyusutanBrgPindah",
  async (_, thunkApi) => {
    try {
      const response = await axios.patch(`${url}/pindah/update`);
      return response.data;
    } catch (error) {
      if (error.response) {
        const errMessage = error.response.data.msg;
        return thunkApi.rejectWithValue(errMessage);
      }
    }
  }
);

const penyusutanInventaris = createSlice({
  name: "penyusutan",
  initialState: initState,
  reducers: { penyusutanReset: (state) => initState },
  extraReducers: (builder) => {
    builder
      .addCase(updatePenyusutanBarang.pending, (state) => {
        state.penyusutan_barang.isLoading = true;
      })
      .addCase(updatePenyusutanBarang.fulfilled, (state, action) => {
        state.penyusutan_barang.isLoading = false;
        state.penyusutan_barang.isSuccess = true;
        state.penyusutan_barang.data = action.payload;
      })
      .addCase(updatePenyusutanBarang.rejected, (state, action) => {
        state.penyusutan_barang.isLoading = false;
        state.penyusutan_barang.isError = true;
        state.penyusutan_barang.errMessage = action.payload;
      });
    builder
      .addCase(updatePenyusutanBrgPindah.pending, (state) => {
        state.penyusutan_barang_pindah.isLoading = true;
      })
      .addCase(updatePenyusutanBrgPindah.fulfilled, (state, action) => {
        state.penyusutan_barang_pindah.isLoading = false;
        state.penyusutan_barang_pindah.isSuccess = true;
        state.penyusutan_barang_pindah.data = action.payload;
      })
      .addCase(updatePenyusutanBrgPindah.rejected, (state, action) => {
        state.penyusutan_barang_pindah.isLoading = false;
        state.penyusutan_barang_pindah.isError = true;
        state.penyusutan_barang_pindah.errMessage = action.payload;
      });
  },
});

export const { penyusutanReset } = penyusutanInventaris.actions;
export default penyusutanInventaris.reducer;
