import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const url = import.meta.env.VITE_API_URL;

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

const initState = {
  data: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

const barangSlice = createSlice({
  name: "barang",
  initialState: initState,
  reducers: { reset: (state) => initState },
  extraReducers: (builder) => {
    builder
      .addCase(getDataBarang.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDataBarang.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload;
      })
      .addCase(getDataBarang.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = barangSlice.actions;
export default barangSlice.reducer;
