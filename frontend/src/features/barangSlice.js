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
  barang_rusak_by_loc: {
    data: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
  },
  barang_unit: {
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
  barang_rusak_diperbaiki: {
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
  unit_barang_by_loc: {
    data: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
  },
};

export const getUnitBarangByLoc = createAsyncThunk(
  "getUnitBarangByLoc/getAllUnitBarangByLoc",
  async (search, thunkApi) => {
    try {
      const response = await axios.get(`${url}/barang/c/loc?search=${search}`);
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

export const getRusakDiperbaiki = createAsyncThunk(
  "allRusakDiperbaiki/getAllRusakDiperbaiki",
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${url}/rusak/get_by_status`);
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

export const getBarangUnit = createAsyncThunk(
  "allBarangUnit/getAllBarangUnit",
  async (inputQuery, thunkApi) => {
    try {
      const response = await axios.get(
        `${url}/barang/c/barang_unit?page=${inputQuery.page}&limit=${inputQuery.limit}&search=${inputQuery.search}`
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

export const getBrgRusakByLoc = createAsyncThunk(
  "allBrgRusakByLoc/getAllBrgRusakByLoc",
  async (locId, thunkApi) => {
    try {
      const response = await axios.get(`${url}/barang/c/loc?search=${locId}`);
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
        `${url}/rusak?page=${inputQuery.page}&limit=${inputQuery.limit}&search=${inputQuery.search}&lokasi=${inputQuery.lokasi}&status_perbaikan=${inputQuery.status_perbaikan}`
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

const barangSlice = createSlice({
  name: "barang",
  initialState: initState,
  reducers: { reset: (state) => initState },
  extraReducers: (builder) => {
    // get unit barang by loc BARANG
    builder
      .addCase(getUnitBarangByLoc.pending, (state) => {
        state.unit_barang_by_loc.isLoading = true;
      })
      .addCase(getUnitBarangByLoc.fulfilled, (state, action) => {
        state.unit_barang_by_loc.isLoading = false;
        state.unit_barang_by_loc.isSuccess = true;
        state.unit_barang_by_loc.data = action.payload;
      })
      .addCase(getUnitBarangByLoc.rejected, (state, action) => {
        state.unit_barang_by_loc.isLoading = false;
        state.unit_barang_by_loc.isError = true;
        state.unit_barang_by_loc.message = action.payload;
      });
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
    // DATA BARANG rusak by loc
    builder
      .addCase(getBrgRusakByLoc.pending, (state) => {
        state.barang_rusak_by_loc.isLoading = true;
      })
      .addCase(getBrgRusakByLoc.fulfilled, (state, action) => {
        state.barang_rusak_by_loc.isLoading = false;
        state.barang_rusak_by_loc.isSuccess = true;
        state.barang_rusak_by_loc.data = action.payload;
      })
      .addCase(getBrgRusakByLoc.rejected, (state, action) => {
        state.barang_rusak_by_loc.isLoading = false;
        state.barang_rusak_by_loc.isError = true;
        state.barang_rusak_by_loc.message = action.payload;
      });
    // DATA BARANG  UNIT
    builder
      .addCase(getBarangUnit.pending, (state) => {
        state.barang_unit.isLoading = true;
      })
      .addCase(getBarangUnit.fulfilled, (state, action) => {
        state.barang_unit.isLoading = false;
        state.barang_unit.isSuccess = true;
        state.barang_unit.data = action.payload;
      })
      .addCase(getBarangUnit.rejected, (state, action) => {
        state.barang_unit.isLoading = false;
        state.barang_unit.isError = true;
        state.barang_unit.message = action.payload;
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
    // BARANG RUSAK DIPERBAIKI
    builder
      .addCase(getRusakDiperbaiki.pending, (state) => {
        state.barang_rusak_diperbaiki.isLoading = true;
      })
      .addCase(getRusakDiperbaiki.fulfilled, (state, action) => {
        state.barang_rusak_diperbaiki.isLoading = false;
        state.barang_rusak_diperbaiki.isSuccess = true;
        state.barang_rusak_diperbaiki.data = action.payload;
      })
      .addCase(getRusakDiperbaiki.rejected, (state, action) => {
        state.barang_rusak_diperbaiki.isLoading = false;
        state.barang_rusak_diperbaiki.isError = true;
        state.barang_rusak_diperbaiki.message = action.payload;
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
  },
});

export const { reset } = barangSlice.actions;
export default barangSlice.reducer;
