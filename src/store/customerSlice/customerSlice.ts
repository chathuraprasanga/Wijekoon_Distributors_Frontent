import {
    createAsyncThunk,
    createSlice,
    Draft,
    PayloadAction,
} from "@reduxjs/toolkit";
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
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/customers/customer`,
                payload
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const getCustomers = createAsyncThunk(
    "customer/getCustomers",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/customers/customers`,
                payload
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const getCustomer = createAsyncThunk(
    "customer/getCustomer",
    async (id: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                `/customers/customer/${id}`
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const updateCustomer = createAsyncThunk(
    "customer/updateCustomer",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `/customers/customer/${payload.id}`,
                payload.values
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const changeStatusCustomer = createAsyncThunk(
    "customer/changeStatus",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `/customers/change-status/${payload.id}`,
                payload.values
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

const customerSlice = createSlice({
    name: "customer",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            addCustomer.fulfilled,
            (_, action: PayloadAction<any>) => {
                return action.payload;
            }
        );
        builder.addCase(
            getCustomers.fulfilled,
            (state: Draft<CustomerState>, action: PayloadAction<any>) => {
                state.customers = action.payload.result;
            }
        );
        builder.addCase(
            getCustomer.fulfilled,
            (state: Draft<CustomerState>, action: PayloadAction<any>) => {
                state.selectedCustomer = action.payload.result;
            }
        );
        builder.addCase(
            updateCustomer.fulfilled,
            (state: Draft<CustomerState>, action: PayloadAction<any>) => {
                state.customers = state.customers.map((customer: any) =>
                    customer._id === action.payload.result._id
                        ? action.payload.result
                        : customer
                );
                state.selectedCustomer = null;
            }
        )
        builder.addCase(
            changeStatusCustomer.fulfilled,
            (state: Draft<CustomerState>, action: PayloadAction<any>) => {
                state.customers = state.customers.map((customer: any) =>
                    customer._id === action.payload.result._id
                        ? action.payload.result
                        : customer
                );
                state.selectedCustomer = null;
            }
        )
    },
});

export default customerSlice.reducer;
