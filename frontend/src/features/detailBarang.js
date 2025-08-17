// detail barang berupa merk,  dan kategori
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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
  kategori: {
    kategori: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    errMessage: false,
  },
  all_merk: {
    merk: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    errMessage: false,
  },
  all_lokasi: {
    lokasi: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    errMessage: false,
  },
  all_kategori: {
    kategori: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    errMessage: false,
  },
};

export const getAllMerk = createAsyncThunk(
  "allMerk/getallMerk",
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${url}/merk/all`);
      return response.data;
    } catch (error) {
      if (error.response) {
        const errMessage = error.response.data.msg;
        return thunkApi.rejectWithValue(errMessage);
      }
    }
  }
);

export const getAllLokasi = createAsyncThunk(
  "allLokasi/getallLokasi",
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${url}/lokasi/all`);
      return response.data;
    } catch (error) {
      if (error.response) {
        const errMessage = error.response.data.msg;
        return thunkApi.rejectWithValue(errMessage);
      }
    }
  }
);

export const getAllKategori = createAsyncThunk(
  "allKategori/getallKategori",
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${url}/kategori/all`);
      return response.data;
    } catch (error) {
      if (error.response) {
        const errMessage = error.response.data.msg;
        return thunkApi.rejectWithValue(errMessage);
      }
    }
  }
);

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
        state.merk.isLoading = false;
        state.merk.isError = true;
        state.merk.errMessage = action.payload;
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
    // get merk tanpa paginasi
    builder
      .addCase(getAllMerk.pending, (state) => {
        state.all_merk.isLoading = true;
      })
      .addCase(getAllMerk.fulfilled, (state, action) => {
        state.all_merk.isLoading = false;
        state.all_merk.isSuccess = true;
        state.all_merk.merk = action.payload;
      })
      .addCase(getAllMerk.rejected, (state, action) => {
        state.all_merk.isLoading = false;
        state.all_merk.isError = true;
        state.all_merk.errMessage = action.payload;
      });
    // get kategori tanpa paginasi
    builder
      .addCase(getAllKategori.pending, (state) => {
        state.all_kategori.isLoading = true;
      })
      .addCase(getAllKategori.fulfilled, (state, action) => {
        state.all_kategori.isLoading = false;
        state.all_kategori.isSuccess = true;
        state.all_kategori.kategori = action.payload;
      })
      .addCase(getAllKategori.rejected, (state, action) => {
        state.all_kategori.isLoading = false;
        state.all_kategori.isError = true;
        state.all_kategori.errMessage = action.payload;
      });
    // get lokasi
    builder
      .addCase(getAllLokasi.pending, (state) => {
        state.all_lokasi.isLoading = true;
      })
      .addCase(getAllLokasi.fulfilled, (state, action) => {
        state.all_lokasi.isLoading = false;
        state.all_lokasi.isSuccess = true;
        state.all_lokasi.lokasi = action.payload;
      })
      .addCase(getAllLokasi.rejected, (state, action) => {
        state.all_lokasi.isLoading = false;
        state.all_lokasi.isError = true;
        state.all_lokasi.errMessage = action.payload;
      });
  },
});

export const { detailStateReset } = detailBrg.actions;
export default detailBrg.reducer;
