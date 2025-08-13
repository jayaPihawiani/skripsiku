// detail barang berupa merk, satuan dan kategori
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const url = import.meta.env.VITE_API_URL;

const initState = {
  kategori_kerusakan: {
    data: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    errMessage: false,
  },
  all_kategori_kerusakan: {
    data: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    errMessage: false,
  },
};

export const getKategoriKerusakan = createAsyncThunk(
  "kategoriKerusakan/getKategoriKerusakan",
  async (inputQuery, thunkApi) => {
    try {
      const response = await axios.get(
        `${url}/kategori_kerusakan?page=${inputQuery.page}&limit=${inputQuery.limit}&search=${inputQuery.search}`
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        const errMessage = error.response.data.msg;
        return thunkApi.rejectWithValue(errMessage);
      }
    }
  }
);

export const getAllKategoriKerusakan = createAsyncThunk(
  "allKategoriKerusakan/getAllKategoriKerusakan",
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${url}/kategori_kerusakan/all`);
      return response.data;
    } catch (error) {
      if (error.response) {
        const errMessage = error.response.data.msg;
        return thunkApi.rejectWithValue(errMessage);
      }
    }
  }
);

const kategoriRusakSlice = createSlice({
  name: "kategori_rusak",
  initialState: initState,
  reducers: { kategoriRusakSliceStateReset: (state) => initState },
  extraReducers: (builder) => {
    // get kategori kerusakan
    builder
      .addCase(getKategoriKerusakan.pending, (state) => {
        state.kategori_kerusakan.isLoading = true;
      })
      .addCase(getKategoriKerusakan.fulfilled, (state, action) => {
        state.kategori_kerusakan.isLoading = false;
        state.kategori_kerusakan.isSuccess = true;
        state.kategori_kerusakan.data = action.payload;
      })
      .addCase(getKategoriKerusakan.rejected, (state, action) => {
        state.kategori_kerusakan.isLoading = false;
        state.kategori_kerusakan.isError = true;
        state.kategori_kerusakan.errMessage = action.payload;
      });
    // get all kategori kerusakan
    builder
      .addCase(getAllKategoriKerusakan.pending, (state) => {
        state.all_kategori_kerusakan.isLoading = true;
      })
      .addCase(getAllKategoriKerusakan.fulfilled, (state, action) => {
        state.all_kategori_kerusakan.isLoading = false;
        state.all_kategori_kerusakan.isSuccess = true;
        state.all_kategori_kerusakan.data = action.payload;
      })
      .addCase(getAllKategoriKerusakan.rejected, (state, action) => {
        state.all_kategori_kerusakan.isLoading = false;
        state.all_kategori_kerusakan.isError = true;
        state.all_kategori_kerusakan.errMessage = action.payload;
      });
  },
});

export const { kategoriRusakSliceStateReset } = kategoriRusakSlice.actions;
export default kategoriRusakSlice.reducer;
