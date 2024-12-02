import {createAsyncThunk, createSlice, Draft, PayloadAction} from "@reduxjs/toolkit";
import axiosInstance from "../../interceptors/axiosInterceptor.ts";

interface CustomerState {
    customers: any;
    selectedCustomer: any;
    status: string;
    error: string;
}

const initialState: CustomerState = {
    customers: [],
    selectedCustomer: {},
    status: "idle",
    error: "",
};

export const addCustomer = createAsyncThunk(
    "customer/addCustomer",
    async (payload: any, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.post(
                `api/v1/customers/customer`,
                payload,
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    },
);

export const getCustomers = createAsyncThunk(
    "customer/getCustomers",
    async (payload:any, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.post(
                `api/v1/customers/customers`, payload,
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    },
);

const customerSlice = createSlice({
    name: "customer",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addCustomer.fulfilled, (_, action: PayloadAction<any>) => {
            return action.payload.result;
        })
        builder.addCase(getCustomers.fulfilled, (state: Draft<CustomerState>, action: PayloadAction<any>) => {
            state.customers = action.payload.result;
        });
    },
});

export default customerSlice.reducer;
