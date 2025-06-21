import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initState = {
  user: {
    data: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    errMessage: "",
  },
  divisi: {
    data: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    errMessage: "",
  },
};

const url = import.meta.env.VITE_API_URL;

// User
export const getDataUser = createAsyncThunk(
  "user/getDataUser",
  async (inputQuery, thunkApi) => {
    try {
      const response = await axios.get(
        `${url}/user?limit=${inputQuery.limit}&page=${inputQuery.page}&search=${inputQuery.search}`
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        const msg = error.response.data.msg;
        return thunkApi.rejectWithValue(msg);
      }
      console.log(error);
    }
  }
);

// divisi user
export const getDataDivisi = createAsyncThunk(
  "divisi/getDivisi",
  async (inputQuery, thunkApi) => {
    try {
      const response = await axios.get(
        `${url}/divisi?page=${inputQuery.page}&limit=${inputQuery.limit}&search=${inputQuery.search}`
      );

      return response.data;
    } catch (error) {
      if (error.response) {
        const msg = error.response.data.msg;
        return thunkApi.rejectWithValue(msg);
      }
      console.error(error);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState: initState,
  reducers: { userStateReset: (state) => initState },
  extraReducers: (builder) => {
    builder
      .addCase(getDataUser.pending, (state) => {
        state.user.isLoading = true;
      })
      .addCase(getDataUser.fulfilled, (state, action) => {
        state.user.isLoading = false;
        state.user.isSuccess = true;
        state.user.data = action.payload;
      })
      .addCase(getDataUser.rejected, (state, action) => {
        state.user.isLoading = false;
        state.user.isError = true;
        state.user.errMessage = action.payload;
      });
    builder
      .addCase(getDataDivisi.pending, (state) => {
        state.divisi.isLoading = true;
      })
      .addCase(getDataDivisi.fulfilled, (state, action) => {
        state.divisi.isLoading = false;
        state.divisi.isSuccess = true;
        state.divisi.data = action.payload;
      })
      .addCase(getDataDivisi.rejected, (state, action) => {
        state.divisi.isLoading = false;
        state.divisi.isError = true;
        state.divisi.errMessage = action.payload;
      });
  },
});

export const { userStateReset } = userSlice.actions;
export default userSlice.reducer;
