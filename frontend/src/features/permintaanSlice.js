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
        state.isLoading = true;
      })
      .addCase(getPermintaan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload;
      })
      .addCase(getPermintaan.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errMessage = action.payload;
      });
  },
});

export const { permintaanStateReset } = permintaanSlice.actions;
export default permintaanSlice.reducer;
