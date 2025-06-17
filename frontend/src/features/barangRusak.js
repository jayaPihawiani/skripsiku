import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initState = {
  data: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

const url = import.meta.env.VITE_API_URL;

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

export const invBarangRusak = createSlice({
  name: "brg_rusak",
  initialState: initState,
  reducers: { brgRusakStateReset: (state) => initState },
  extraReducers: (builder) => {
    builder
      .addCase(getBrgRusak.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBrgRusak.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload;
      })
      .addCase(getBrgRusak.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = invBarangRusak.actions;
export default invBarangRusak.reducer;
