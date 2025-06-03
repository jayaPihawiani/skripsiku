import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const url = import.meta.env.VITE_API_URL;

const initState = {
  data: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  isLogout: false,
};

// Thunk
export const loginUser = createAsyncThunk(
  "user/userLogin",
  async (data, thunkApi) => {
    try {
      const response = await axios.post(`${url}/auth/login`, data);
      return response.data;
    } catch (error) {
      if (error.response) {
        const errMessage = error.response.data.msg;
        return thunkApi.rejectWithValue(errMessage);
      }
    }
  }
);

export const userInfo = createAsyncThunk(
  "user/userInfo",
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${url}/auth/uInfo`);
      return response.data;
    } catch (error) {
      if (error.response) {
        const errMessage = error.response.data.msg;
        return thunkApi.rejectWithValue(errMessage);
      }
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, thunkApi) => {
    try {
      const response = await axios.delete(`${url}/auth/logout`);
      return response.data;
    } catch (error) {
      if (error.response) {
        const errMessage = error.response.data.msg;
        return thunkApi.rejectWithValue(errMessage);
      }
    }
  }
);
// Thunk

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState: initState,
  reducers: { authStateReset: (state) => initState },
  extraReducers: (builder) => {
    // LOGIN
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });

    // INFO
    builder
      .addCase(userInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(userInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLogout = true;
        state.data = action.payload;
      })
      .addCase(userInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });

    // LOGOUT
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});
// Slice

export const { authStateReset } = authSlice.actions;
export default authSlice.reducer;
