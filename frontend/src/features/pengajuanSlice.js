import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const url = import.meta.env.VITE_API_URL;

const initState = {
  pengajuan: {
    data: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    errMessage: false,
  },
  all_pengajuan: {
    data: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    errMessage: false,
  },
};

export const getAllPengajuan = createAsyncThunk(
  "allPengajuan/getallPengajuan",
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${url}/pengajuan/all`);
      return response.data;
    } catch (error) {
      if (error.response) {
        const errMessage = error.response.data.msg;
        return thunkApi.rejectWithValue(errMessage);
      }
    }
  }
);

export const getPengajuan = createAsyncThunk(
  "pengajuan/getPengajuan",
  async (inputQuery, thunkApi) => {
    try {
      const response = await axios.get(
        `${url}/pengajuan?limit=${inputQuery.limit}&page=${inputQuery.page}&search=${inputQuery.search}`
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

const pengajuanSlice = createSlice({
  name: "pengajuan",
  initialState: initState,
  reducers: { pengajuanStateReset: (state) => initState },
  extraReducers: (builder) => {
    builder
      .addCase(getPengajuan.pending, (state) => {
        state.pengajuan.isLoading = true;
      })
      .addCase(getPengajuan.fulfilled, (state, action) => {
        state.pengajuan.isLoading = false;
        state.pengajuan.isSuccess = true;
        state.pengajuan.data = action.payload;
      })
      .addCase(getPengajuan.rejected, (state, action) => {
        state.pengajuan.isLoading = false;
        state.pengajuan.isError = true;
        state.pengajuan.errMessage = action.payload;
      });
    builder
      .addCase(getAllPengajuan.pending, (state) => {
        state.all_pengajuan.isLoading = true;
      })
      .addCase(getAllPengajuan.fulfilled, (state, action) => {
        state.all_pengajuan.isLoading = false;
        state.all_pengajuan.isSuccess = true;
        state.all_pengajuan.data = action.payload;
      })
      .addCase(getAllPengajuan.rejected, (state, action) => {
        state.all_pengajuan.isLoading = false;
        state.all_pengajuan.isError = true;
        state.all_pengajuan.errMessage = action.payload;
      });
  },
});

export const { pengajuanStateReset } = pengajuanSlice.actions;
export default pengajuanSlice.reducer;
