import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const url = import.meta.env.VITE_API_URL;

const initState = {
  barang: {
    data: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
  },
  barang_masuk: {
    data: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
  },
  pemindahan: {
    data: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
  },
  penghapusan: {
    data: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
  },
  barang_rusak: {
    data: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
  },
  distribusi: {
    data: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
  },
};

export const getBrgRusak = createAsyncThunk(
  "brgRusak/getBrgRusak",
  async (inputQuery, thunkApi) => {
    try {
      const response = await axios.get(
        `${url}/rusak?page=${inputQuery.page}&limit=${inputQuery.limit}&search=${inputQuery.search}`
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        const msg = error.response.data.msg;
        return thunkApi.rejectWithValue(msg);
      }
    }
  }
);

export const getDataPenghapusan = createAsyncThunk(
  "penghapusan/getDataPenghapusan",
  async (inputQuery, thunkApi) => {
    try {
      const response = await axios.get(
        `${url}/penghapusan?page=${inputQuery.page}&limit=${inputQuery.limit}&search=${inputQuery.search}`
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

export const getDataBarang = createAsyncThunk(
  "barang/getBarang",
  async (inputQuery, thunkApi) => {
    try {
      const response = await axios.get(
        `${url}/barang?page=${inputQuery.page}&limit=${inputQuery.limit}&search=${inputQuery.search}`
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        const errMessage = error.response.data;
        return thunkApi.rejectWithValue(errMessage);
      }
    }
  }
);

export const getDataBarangMasuk = createAsyncThunk(
  "masuk/getBarangMasuk",
  async (inputQuery, thunkApi) => {
    try {
      const response = await axios.get(
        `${url}/masuk?page=${inputQuery.page}&limit=${inputQuery.limit}&search=${inputQuery.search}`
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        const errMessage = error.response.data;
        return thunkApi.rejectWithValue(errMessage);
      }
    }
  }
);

export const getDataPemindahan = createAsyncThunk(
  "pindah/getBarangPindah",
  async (inputQuery, thunkApi) => {
    try {
      const response = await axios.get(
        `${url}/pindah?page=${inputQuery.page}&limit=${inputQuery.limit}&search=${inputQuery.search}`
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        const errMessage = error.response.data;
        return thunkApi.rejectWithValue(errMessage);
      }
    }
  }
);

export const getDataDistribusi = createAsyncThunk(
  "distribusi/getDistribusi",
  async (inputQuery, thunkApi) => {
    try {
      const response = await axios.get(
        `${url}/distribusi?page=${inputQuery.page}&limit=${inputQuery.limit}&search=${inputQuery.search}`
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        const errMessage = error.response.data;
        return thunkApi.rejectWithValue(errMessage);
      }
    }
  }
);

const barangSlice = createSlice({
  name: "barang",
  initialState: initState,
  reducers: { reset: (state) => initState },
  extraReducers: (builder) => {
    // DATA BARANG
    builder
      .addCase(getDataBarang.pending, (state) => {
        state.barang.isLoading = true;
      })
      .addCase(getDataBarang.fulfilled, (state, action) => {
        state.barang.isLoading = false;
        state.barang.isSuccess = true;
        state.barang.data = action.payload;
      })
      .addCase(getDataBarang.rejected, (state, action) => {
        state.barang.isLoading = false;
        state.barang.isError = true;
        state.barang.message = action.payload;
      });
    // BARANG MASUK
    builder
      .addCase(getDataBarangMasuk.pending, (state) => {
        state.barang_masuk.isLoading = true;
      })
      .addCase(getDataBarangMasuk.fulfilled, (state, action) => {
        state.barang_masuk.isLoading = false;
        state.barang_masuk.isSuccess = true;
        state.barang_masuk.data = action.payload;
      })
      .addCase(getDataBarangMasuk.rejected, (state, action) => {
        state.barang_masuk.isLoading = false;
        state.barang_masuk.isError = true;
        state.barang_masuk.message = action.payload;
      });
    // PEMINDAHAN
    builder
      .addCase(getDataPemindahan.pending, (state) => {
        state.pemindahan.isLoading = true;
      })
      .addCase(getDataPemindahan.fulfilled, (state, action) => {
        state.pemindahan.isLoading = false;
        state.pemindahan.isSuccess = true;
        state.pemindahan.data = action.payload;
      })
      .addCase(getDataPemindahan.rejected, (state, action) => {
        state.pemindahan.isLoading = false;
        state.pemindahan.isError = true;
        state.pemindahan.message = action.payload;
      });
    // PENGHAPUSAN
    builder
      .addCase(getDataPenghapusan.pending, (state) => {
        state.penghapusan.isLoading = true;
      })
      .addCase(getDataPenghapusan.fulfilled, (state, action) => {
        state.penghapusan.isLoading = false;
        state.penghapusan.isSuccess = true;
        state.penghapusan.data = action.payload;
      })
      .addCase(getDataPenghapusan.rejected, (state, action) => {
        state.penghapusan.isLoading = false;
        state.penghapusan.isError = true;
        state.penghapusan.message = action.payload;
      });
    // BARANG RUSAK
    builder
      .addCase(getBrgRusak.pending, (state) => {
        state.barang_rusak.isLoading = true;
      })
      .addCase(getBrgRusak.fulfilled, (state, action) => {
        state.barang_rusak.isLoading = false;
        state.barang_rusak.isSuccess = true;
        state.barang_rusak.data = action.payload;
      })
      .addCase(getBrgRusak.rejected, (state, action) => {
        state.barang_rusak.isLoading = false;
        state.barang_rusak.isError = true;
        state.barang_rusak.message = action.payload;
      });
    // DISTRIBUSI
    builder
      .addCase(getDataDistribusi.pending, (state) => {
        state.distribusi.isLoading = true;
      })
      .addCase(getDataDistribusi.fulfilled, (state, action) => {
        state.distribusi.isLoading = false;
        state.distribusi.isSuccess = true;
        state.distribusi.data = action.payload;
      })
      .addCase(getDataDistribusi.rejected, (state, action) => {
        state.distribusi.isLoading = false;
        state.distribusi.isError = true;
        state.distribusi.message = action.payload;
      });
  },
});

export const { reset } = barangSlice.actions;
export default barangSlice.reducer;
