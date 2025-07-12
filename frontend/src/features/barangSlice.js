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
  all_barang: {
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
  all_barang_masuk: {
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
  all_pemindahan: {
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
  all_penghapusan: {
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
  all_barang_rusak: {
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
  all_distribusi: {
    data: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
  },
};

export const getAllDistribusi = createAsyncThunk(
  "allDistribusi/getAllDistribusi",
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${url}/distribusi/all`);
      return response.data;
    } catch (error) {
      if (error.response) {
        const msg = error.response.data.msg;
        console.error(errMessage);
        return thunkApi.rejectWithValue(msg);
      } else {
        console.error(error);
      }
    }
  }
);

export const getAllPenghapusan = createAsyncThunk(
  "allPenghapusan/getAllPenghapusan",
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${url}/penghapusan/all`);
      return response.data;
    } catch (error) {
      if (error.response) {
        const msg = error.response.data.msg;
        console.error(errMessage);
        return thunkApi.rejectWithValue(msg);
      } else {
        console.error(error);
      }
    }
  }
);

export const getAllRusak = createAsyncThunk(
  "allRusak/getAllRusak",
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${url}/rusak/all`);
      return response.data;
    } catch (error) {
      if (error.response) {
        const msg = error.response.data.msg;
        console.error(errMessage);
        return thunkApi.rejectWithValue(msg);
      } else {
        console.error(error);
      }
    }
  }
);

export const getAllPindah = createAsyncThunk(
  "allPindah/getAllPindah",
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${url}/pindah/all`);
      return response.data;
    } catch (error) {
      if (error.response) {
        const msg = error.response.data.msg;
        console.error(errMessage);
        return thunkApi.rejectWithValue(msg);
      } else {
        console.error(error);
      }
    }
  }
);

export const getAllBarang = createAsyncThunk(
  "allBarang/getAllBarang",
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${url}/barang/all`);
      return response.data;
    } catch (error) {
      if (error.response) {
        const msg = error.response.data.msg;
        console.error(errMessage);
        return thunkApi.rejectWithValue(msg);
      } else {
        console.error(error);
      }
    }
  }
);

export const getAllBrgMasuk = createAsyncThunk(
  "allMasuk/getAllMasuk",
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${url}/masuk/all`);
      return response.data;
    } catch (error) {
      if (error.response) {
        const msg = error.response.data.msg;
        console.error(errMessage);
        return thunkApi.rejectWithValue(msg);
      } else {
        console.error(error);
      }
    }
  }
);

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
        console.error(errMessage);
        return thunkApi.rejectWithValue(msg);
      } else {
        console.error(error);
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
        console.error(errMessage);
        return thunkApi.rejectWithValue(errMessage);
      } else {
        console.error(error);
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
        console.error(errMessage);
        return thunkApi.rejectWithValue(errMessage);
      } else {
        console.error(error);
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
        console.error(errMessage);
        return thunkApi.rejectWithValue(errMessage);
      } else {
        console.error(error);
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
        console.error(errMessage);
        return thunkApi.rejectWithValue(errMessage);
      } else {
        console.error(error);
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
        console.error(errMessage);

        return thunkApi.rejectWithValue(errMessage);
      } else {
        console.error(error);
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
    // DATA BARANG TANPA PAGINASI
    builder
      .addCase(getAllBarang.pending, (state) => {
        state.all_barang.isLoading = true;
      })
      .addCase(getAllBarang.fulfilled, (state, action) => {
        state.all_barang.isLoading = false;
        state.all_barang.isSuccess = true;
        state.all_barang.data = action.payload;
      })
      .addCase(getAllBarang.rejected, (state, action) => {
        state.all_barang.isLoading = false;
        state.all_barang.isError = true;
        state.all_barang.message = action.payload;
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
    // BARANG MASUK TANPA PAGINASI
    builder
      .addCase(getAllBrgMasuk.pending, (state) => {
        state.all_barang_masuk.isLoading = true;
      })
      .addCase(getAllBrgMasuk.fulfilled, (state, action) => {
        state.all_barang_masuk.isLoading = false;
        state.all_barang_masuk.isSuccess = true;
        state.all_barang_masuk.data = action.payload;
      })
      .addCase(getAllBrgMasuk.rejected, (state, action) => {
        state.all_barang_masuk.isLoading = false;
        state.all_barang_masuk.isError = true;
        state.all_barang_masuk.message = action.payload;
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
    // PEMINDAHAN TANPA PAGINASI
    builder
      .addCase(getAllPindah.pending, (state) => {
        state.all_pemindahan.isLoading = true;
      })
      .addCase(getAllPindah.fulfilled, (state, action) => {
        state.all_pemindahan.isLoading = false;
        state.all_pemindahan.isSuccess = true;
        state.all_pemindahan.data = action.payload;
      })
      .addCase(getAllPindah.rejected, (state, action) => {
        state.all_pemindahan.isLoading = false;
        state.all_pemindahan.isError = true;
        state.all_pemindahan.message = action.payload;
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
    // PENGHAPUSAN TANPA PAGINASI
    builder
      .addCase(getAllPenghapusan.pending, (state) => {
        state.all_penghapusan.isLoading = true;
      })
      .addCase(getAllPenghapusan.fulfilled, (state, action) => {
        state.all_penghapusan.isLoading = false;
        state.all_penghapusan.isSuccess = true;
        state.all_penghapusan.data = action.payload;
      })
      .addCase(getAllPenghapusan.rejected, (state, action) => {
        state.all_penghapusan.isLoading = false;
        state.all_penghapusan.isError = true;
        state.all_penghapusan.message = action.payload;
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
    // BARANG RUSAK TANPA PAGINASI
    builder
      .addCase(getAllRusak.pending, (state) => {
        state.all_barang_rusak.isLoading = true;
      })
      .addCase(getAllRusak.fulfilled, (state, action) => {
        state.all_barang_rusak.isLoading = false;
        state.all_barang_rusak.isSuccess = true;
        state.all_barang_rusak.data = action.payload;
      })
      .addCase(getAllRusak.rejected, (state, action) => {
        state.all_barang_rusak.isLoading = false;
        state.all_barang_rusak.isError = true;
        state.all_barang_rusak.message = action.payload;
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
    // DISTRIBUSI TANPA PAGINASI
    builder
      .addCase(getAllDistribusi.pending, (state) => {
        state.all_distribusi.isLoading = true;
      })
      .addCase(getAllDistribusi.fulfilled, (state, action) => {
        state.all_distribusi.isLoading = false;
        state.all_distribusi.isSuccess = true;
        state.all_distribusi.data = action.payload;
      })
      .addCase(getAllDistribusi.rejected, (state, action) => {
        state.all_distribusi.isLoading = false;
        state.all_distribusi.isError = true;
        state.all_distribusi.message = action.payload;
      });
  },
});

export const { reset } = barangSlice.actions;
export default barangSlice.reducer;
