// detail barang berupa merk, satuan dan kategori
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = import.meta.env.VITE_API_URL;
const initState = {
  kategori: null,
  satuan: null,
  merk: null,
  lokasi: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  errMessage: false,
};

export const getMerkBarang = createAsyncThunk(
  "merk/getMerkBarang",
  async (inputQuery, thunkApi) => {
    try {
      const response = await axios.get(
        `${url}/merk?page=${inputQuery.page}&limit=${inputQuery.limit}&search=${inputQuery.search}`
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

export const getSatuanBarang = createAsyncThunk(
  "merk/getSatuanBarang",
  async (inputQuery, thunkApi) => {
    try {
      const response = await axios.get(
        `${url}/satuan?page=${inputQuery.page}&limit=${inputQuery.limit}&search=${inputQuery.search}`
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

export const getKategoriBarang = createAsyncThunk(
  "kategori/getKategoriBarang",
  async (inputQuery, thunkApi) => {
    try {
      const response = await axios.get(
        `${url}/kategori?page=${inputQuery.page}&limit=${inputQuery.limit}&search=${inputQuery.search}`
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

export const getDataLokasi = createAsyncThunk(
  "lokasi/getDataLokasi",
  async (inputQuery, thunkApi) => {
    try {
      const response = await axios.get(
        `${url}/lokasi?page=${inputQuery.page}&limit=${inputQuery.limit}&search=`
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

const detailBrg = createSlice({
  name: "detail_brg",
  initialState: initState,
  reducers: { detailStateReset: (state) => initState },
  extraReducers: (builder) => {
    // get merk
    builder
      .addCase(getMerkBarang.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMerkBarang.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.merk = action.payload;
      })
      .addCase(getMerkBarang.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errMessage = action.payload;
      });
    // get satuan
    builder
      .addCase(getSatuanBarang.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSatuanBarang.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.satuan = action.payload;
      })
      .addCase(getSatuanBarang.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errMessage = action.payload;
      });
    // get kategori
    builder
      .addCase(getKategoriBarang.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getKategoriBarang.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.kategori = action.payload;
      })
      .addCase(getKategoriBarang.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errMessage = action.payload;
      });
    // get lokasi
    builder
      .addCase(getDataLokasi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDataLokasi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.lokasi = action.payload;
      })
      .addCase(getDataLokasi.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errMessage = action.payload;
      });
  },
});

export const { detailStateReset } = detailBrg.actions;
export default detailBrg.reducer;
