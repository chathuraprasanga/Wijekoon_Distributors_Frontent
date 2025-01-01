import { createAsyncThunk, createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../interceptors/axiosInterceptor.ts";

interface dashboardState {
    user: any;
    usersCount: number;
    customersCount: number;
    productsCount: number;
    suppliersCount: number;
    chequesCount: number;
    invoicesCount: number;
    chequesToDeposit: object;
    invoicesToBePaid: object;
    status: string;
    error: string;
}

const initialState: dashboardState = {
    user: {},
    usersCount: 0,
    customersCount: 0,
    productsCount: 0,
    suppliersCount: 0,
    chequesCount: 0,
    invoicesCount: 0,
    chequesToDeposit: {},
    invoicesToBePaid:{},
    status: "idle",
    error: "",
};

export const getDashboardDetails = createAsyncThunk(
    "dashboard/getDetails",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/dashboard/details`,
                payload,
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    },
);

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            getDashboardDetails.fulfilled,
            (state: Draft<dashboardState>, action: PayloadAction<any>) => {
                Object.assign(state, action.payload.result);
            }
        );
    },
});

export default dashboardSlice.reducer;
