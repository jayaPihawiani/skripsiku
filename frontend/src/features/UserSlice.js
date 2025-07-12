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
  all_user: {
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
  all_divisi: {
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

export const getAllUser = createAsyncThunk(
  "allUser/getAllUser",
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${url}/user/all`);
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

export const getAllDivisi = createAsyncThunk(
  "allDivisi/getAllDivisi",
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${url}/divisi/all`);
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
    builder
      .addCase(getAllUser.pending, (state) => {
        state.all_user.isLoading = true;
      })
      .addCase(getAllUser.fulfilled, (state, action) => {
        state.all_user.isLoading = false;
        state.all_user.isSuccess = true;
        state.all_user.data = action.payload;
      })
      .addCase(getAllUser.rejected, (state, action) => {
        state.all_user.isLoading = false;
        state.all_user.isError = true;
        state.all_user.errMessage = action.payload;
      });
    builder
      .addCase(getAllDivisi.pending, (state) => {
        state.all_divisi.isLoading = true;
      })
      .addCase(getAllDivisi.fulfilled, (state, action) => {
        state.all_divisi.isLoading = false;
        state.all_divisi.isSuccess = true;
        state.all_divisi.data = action.payload;
      })
      .addCase(getAllDivisi.rejected, (state, action) => {
        state.all_divisi.isLoading = false;
        state.all_divisi.isError = true;
        state.all_divisi.errMessage = action.payload;
      });
  },
});

export const { userStateReset } = userSlice.actions;
export default userSlice.reducer;
