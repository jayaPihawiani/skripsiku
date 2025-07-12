import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const url = import.meta.env.VITE_API_URL;

const initState = {
  permintaan: {
    data: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    errMessage: false,
  },
  all_permintaan: {
    data: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    errMessage: false,
  },
};

export const getAllPermintaan = createAsyncThunk(
  "allPermintaan/getallPermintaan",
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${url}/permintaan/all`);
      return response.data;
    } catch (error) {
      if (error.response) {
        const errMessage = error.response.data.msg;
        return thunkApi.rejectWithValue(errMessage);
      }
    }
  }
);

export const getPermintaan = createAsyncThunk(
  "permintaan/getPermintaan",
  async (inputQuery, thunkApi) => {
    try {
      const response = await axios.get(
        `${url}/permintaan?limit=${inputQuery.limit}&page=${inputQuery.page}&search=${inputQuery.search}`
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

const permintaanSlice = createSlice({
  name: "permintaan",
  initialState: initState,
  reducers: { permintaanStateReset: (state) => initState },
  extraReducers: (builder) => {
    builder
      .addCase(getPermintaan.pending, (state) => {
        state.permintaan.isLoading = true;
      })
      .addCase(getPermintaan.fulfilled, (state, action) => {
        state.permintaan.isLoading = false;
        state.permintaan.isSuccess = true;
        state.permintaan.data = action.payload;
      })
      .addCase(getPermintaan.rejected, (state, action) => {
        state.permintaan.isLoading = false;
        state.permintaan.isError = true;
        state.permintaan.errMessage = action.payload;
      });
    builder
      .addCase(getAllPermintaan.pending, (state) => {
        state.all_permintaan.isLoading = true;
      })
      .addCase(getAllPermintaan.fulfilled, (state, action) => {
        state.all_permintaan.isLoading = false;
        state.all_permintaan.isSuccess = true;
        state.all_permintaan.data = action.payload;
      })
      .addCase(getAllPermintaan.rejected, (state, action) => {
        state.all_permintaan.isLoading = false;
        state.all_permintaan.isError = true;
        state.all_permintaan.errMessage = action.payload;
      });
  },
});

export const { permintaanStateReset } = permintaanSlice.actions;
export default permintaanSlice.reducer;
