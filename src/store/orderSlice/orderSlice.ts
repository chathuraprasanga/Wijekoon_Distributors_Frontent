import {
    createAsyncThunk,
    createSlice,
    Draft,
    PayloadAction,
} from "@reduxjs/toolkit";
import axiosInstance from "../../interceptors/axiosInterceptor.ts";

interface OrderState {
    orders: any;
    selectedSalesOrder: any;
    status: string;
    error: string;
}

const initialState: OrderState = {
    orders: [],
    selectedSalesOrder: {},
    status: "idle",
    error: "",
};

export const addOrder = createAsyncThunk(
    "order/addOrder",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/orders/order`,
                payload
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const getOrders = createAsyncThunk(
    "order/getOrders",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/orders/orders`,
                payload
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const getPagedOrders = createAsyncThunk(
    "order/getPagedOrders",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/orders/paged-orders`,
                payload
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const getOrder = createAsyncThunk(
    "order/getOrder",
    async (id: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                `/orders/order/${id}`
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const updateOrder = createAsyncThunk(
    "order/updateOrder",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `/orders/order/${payload.id}`,
                payload.values
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const changeStatusOrder = createAsyncThunk(
    "order/changeStatus",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `/orders/change-status/${payload.id}`,
                payload.values
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            addOrder.fulfilled,
            (_, action: PayloadAction<any>) => {
                return action.payload;
            }
        );
        builder.addCase(
            getOrders.fulfilled,
            (state: Draft<OrderState>, action: PayloadAction<any>) => {
                state.orders = action.payload.result;
            }
        );
        builder.addCase(
            getPagedOrders.fulfilled,
            (state: Draft<OrderState>, action: PayloadAction<any>) => {
                state.orders = action.payload.result.response;
            }
        );
        builder.addCase(
            getOrder.fulfilled,
            (state: Draft<OrderState>, action: PayloadAction<any>) => {
                state.selectedSalesOrder = action.payload.result;
            }
        );
        builder.addCase(
            updateOrder.fulfilled,
            (state: Draft<OrderState>, action: PayloadAction<any>) => {
                state.orders = state.orders.map((o: any) =>
                    o._id === action.payload.result._id
                        ? action.payload.result
                        : o
                );
                state.selectedSalesOrder = null;
            }
        );
        builder.addCase(
            changeStatusOrder.fulfilled,
            (state: Draft<OrderState>, action: PayloadAction<any>) => {
                state.orders = state.orders.map((o: any) =>
                    o._id === action.payload.result._id
                        ? action.payload.result
                        : o
                );
                state.selectedSalesOrder = null;
            }
        );
    },
});

export default orderSlice.reducer;
