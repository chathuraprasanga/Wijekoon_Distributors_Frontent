import {
    createAsyncThunk,
    createSlice,
    Draft,
    PayloadAction,
} from "@reduxjs/toolkit";
import axiosInstance from "../../interceptors/axiosInterceptor.ts";

interface UserState {
    users: any;
    selectedUser: any;
    status: string;
    error: string;
}

const initialState: UserState = {
    users: [],
    selectedUser: {},
    status: "idle",
    error: "",
};

export const addUser = createAsyncThunk(
    "user/addUser",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/users/signup`,
                payload
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const getUsers = createAsyncThunk(
    "user/getUsers",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/users/users`,
                payload
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const getUser = createAsyncThunk(
    "user/getUser",
    async (id: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                `/users/user/${id}`
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const updateUser = createAsyncThunk(
    "user/updateUser",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `/users/user/${payload.id}`,
                payload.values
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const changeStatusUser = createAsyncThunk(
    "user/changeStatus",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `/users/change-status/${payload.id}`,
                payload.values
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            addUser.fulfilled,
            (_, action: PayloadAction<any>) => {
                return action.payload;
            }
        );
        builder.addCase(
            getUsers.fulfilled,
            (state: Draft<UserState>, action: PayloadAction<any>) => {
                state.users = action.payload.result;
            }
        );
        builder.addCase(
            getUser.fulfilled,
            (state: Draft<UserState>, action: PayloadAction<any>) => {
                state.selectedUser = action.payload.result;
            }
        );
        builder.addCase(
            updateUser.fulfilled,
            (state: Draft<UserState>, action: PayloadAction<any>) => {
                state.users = state.users.map((supplier: any) =>
                    supplier._id === action.payload.result._id
                        ? action.payload.result
                        : supplier
                );
                state.selectedUser = null;
            }
        );
        builder.addCase(
            changeStatusUser.fulfilled,
            (state: Draft<UserState>, action: PayloadAction<any>) => {
                state.users = state.users.map((supplier: any) =>
                    supplier._id === action.payload.result._id
                        ? action.payload.result
                        : supplier
                );
                state.selectedUser = null;
            }
        );
    },
});

export default userSlice.reducer;
