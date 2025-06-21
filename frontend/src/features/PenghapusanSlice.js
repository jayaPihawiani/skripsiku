import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const url = import.meta.env.VITE_API_URL;
const initState = {
  data: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  errMessage: false,
};

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

const penghapusanSlice = createSlice({
  name: "detail_brg",
  initialState: initState,
  reducers: { penghapusanStateReset: (state) => initState },
  extraReducers: (builder) => {
    // get merk
    builder
      .addCase(getDataPenghapusan.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDataPenghapusan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload;
      })
      .addCase(getDataPenghapusan.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errMessage = action.payload;
      });
  },
});

export const { penghapusanStateReset } = penghapusanSlice.actions;
export default penghapusanSlice.reducer;
