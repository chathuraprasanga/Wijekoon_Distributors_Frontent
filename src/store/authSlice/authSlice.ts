import {
  createAsyncThunk,
  createSlice,
  Draft,
  PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../interceptors/axiosInterceptor";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface AuthState {
  user: any;
  status: string;
  error: string;
}

const initialState: AuthState = {
  user: {},
  status: "idle",
  error: "",
};

export const login = createAsyncThunk(
  "auth/login",
  async (payload: any, { rejectWithValue }) => {
    try {
        console.log(backendUrl);
      const response = await axios.post(
        `${backendUrl}/users/login`,
        payload,
      );
      return response.data;
    } catch (err: any) {
      throw rejectWithValue(err.response.data);
    }
  },
);

export const confirmUserLogin = createAsyncThunk(
  "auth/user",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/users/confirm-login`);
      return response.data;
    } catch (err: any) {
      throw rejectWithValue(err.response.data);
    }
  },
);

export const tokenRefresh = createAsyncThunk(
  "auth/tokenRefresh",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendUrl}/users/token-refresh`,
        { refreshToken: localStorage.getItem("REFRESH_TOKEN") },
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: (state: Draft<AuthState>) => {
      state.user = {};
      localStorage.clear();
      localStorage.setItem("ACCESS_TOKEN", "");
      localStorage.setItem("REFRESH_TOKEN", "");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (_, action: PayloadAction<any>) => {
        const { accessToken, refreshToken } = action.payload.result;
        localStorage.setItem("ACCESS_TOKEN", accessToken);
        localStorage.setItem("REFRESH_TOKEN", refreshToken);
      })
      .addCase(
        confirmUserLogin.fulfilled,
        (state: Draft<AuthState>, action: PayloadAction<any>) => {
          state.user = action.payload.result;
        },
      )
      .addCase(tokenRefresh.fulfilled, (_, action: PayloadAction<any>) => {
        const { refreshToken } = action.payload.result;
        localStorage.setItem("REFRESH_TOKEN", refreshToken);
      });
  },
});

export const { logOut } = authSlice.actions;
export default authSlice.reducer;
