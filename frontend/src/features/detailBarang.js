// detail barang berupa merk, satuan dan kategori
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = import.meta.env.VITE_API_URL;
const initState = {
  merk: {
    merk: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    errMessage: false,
  },
  lokasi: {
    lokasi: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    errMessage: false,
  },
  satuan: {
    satuan: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    errMessage: false,
  },
  kategori: {
    kategori: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    errMessage: false,
  },
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
        `${url}/lokasi?page=${inputQuery.page}&limit=${inputQuery.limit}&search=${inputQuery.search}`
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
        state.merk.isLoading = true;
      })
      .addCase(getMerkBarang.fulfilled, (state, action) => {
        state.merk.isLoading = false;
        state.merk.isSuccess = true;
        state.merk.merk = action.payload;
      })
      .addCase(getMerkBarang.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errMessage = action.payload;
      });
    // get satuan
    builder
      .addCase(getSatuanBarang.pending, (state) => {
        state.satuan.isLoading = true;
      })
      .addCase(getSatuanBarang.fulfilled, (state, action) => {
        state.satuan.isLoading = false;
        state.satuan.isSuccess = true;
        state.satuan.satuan = action.payload;
      })
      .addCase(getSatuanBarang.rejected, (state, action) => {
        state.satuan.isLoading = false;
        state.satuan.isError = true;
        state.satuan.errMessage = action.payload;
      });
    // get kategori
    builder
      .addCase(getKategoriBarang.pending, (state) => {
        state.kategori.isLoading = true;
      })
      .addCase(getKategoriBarang.fulfilled, (state, action) => {
        state.kategori.isLoading = false;
        state.kategori.isSuccess = true;
        state.kategori.kategori = action.payload;
      })
      .addCase(getKategoriBarang.rejected, (state, action) => {
        state.kategori.isLoading = false;
        state.kategori.isError = true;
        state.kategori.errMessage = action.payload;
      });
    // get lokasi
    builder
      .addCase(getDataLokasi.pending, (state) => {
        state.lokasi.isLoading = true;
      })
      .addCase(getDataLokasi.fulfilled, (state, action) => {
        state.lokasi.isLoading = false;
        state.lokasi.isSuccess = true;
        state.lokasi.lokasi = action.payload;
      })
      .addCase(getDataLokasi.rejected, (state, action) => {
        state.lokasi.isLoading = false;
        state.lokasi.isError = true;
        state.lokasi.errMessage = action.payload;
      });
  },
});

export const { detailStateReset } = detailBrg.actions;
export default detailBrg.reducer;
