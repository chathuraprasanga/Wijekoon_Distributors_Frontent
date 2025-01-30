import {
    createAsyncThunk,
    createSlice,
    Draft,
    PayloadAction,
} from "@reduxjs/toolkit";
import axiosInstance from "../../interceptors/axiosInterceptor.ts";

interface WarehouseState {
    warehouses: any;
    selectedWarehouse: any;
    status: string;
    error: string;
}

const initialState: WarehouseState = {
    warehouses: [],
    selectedWarehouse: {},
    status: "idle",
    error: "",
};

export const addWarehouse = createAsyncThunk(
    "warehouse/addWarehouse",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/warehouses/warehouse`,
                payload
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const getWarehouses = createAsyncThunk(
    "warehouse/getWarehouses",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/warehouses/warehouses`,
                payload
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const getWarehouse = createAsyncThunk(
    "warehouse/getWarehouse",
    async (id: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                `/warehouses/warehouse/${id}`
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const updateWarehouse = createAsyncThunk(
    "warehouse/updateWarehouse",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `/warehouses/warehouse/${payload.id}`,
                payload.values
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const updateStockDetailsForWarehouse = createAsyncThunk(
    "warehouse/updateStockDetailsForWarehouse",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `/warehouses/stock-update/${payload.id}`,
                payload.values
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const changeStatusWarehouse = createAsyncThunk(
    "warehouse/changeStatus",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `/warehouses/change-status/${payload.id}`,
                payload.values
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const getPagedWarehouses = createAsyncThunk(
    "warehouse/getPagedWarehouses",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/warehouses/paged-warehouses`,
                payload
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

const warehousesSlice = createSlice({
    name: "warehouse",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            addWarehouse.fulfilled,
            (_, action: PayloadAction<any>) => {
                return action.payload;
            }
        );
        builder.addCase(
            getWarehouses.fulfilled,
            (state: Draft<WarehouseState>, action: PayloadAction<any>) => {
                state.warehouses = action.payload.result;
            }
        );
        builder.addCase(
            getWarehouse.fulfilled,
            (state: Draft<WarehouseState>, action: PayloadAction<any>) => {
                state.selectedWarehouse = action.payload.result;
            }
        );
        builder.addCase(
            updateWarehouse.fulfilled,
            (state: Draft<WarehouseState>, action: PayloadAction<any>) => {
                state.warehouses = state.warehouses.map((w: any) =>
                    w._id === action.payload.result._id
                        ? action.payload.result
                        : w
                );
                state.selectedWarehouse = null;
            }
        );
        builder.addCase(
            changeStatusWarehouse.fulfilled,
            (state: Draft<WarehouseState>, action: PayloadAction<any>) => {
                state.warehouses = state.warehouses.map((w: any) =>
                    w._id === action.payload.result._id
                        ? action.payload.result
                        : w
                );
                state.selectedWarehouse = null;
            }
        );
        builder.addCase(
            getPagedWarehouses.fulfilled,
            (state: Draft<WarehouseState>, action: PayloadAction<any>) => {
                state.warehouses = action.payload.result.response;
            }
        );
    },
});

export default warehousesSlice.reducer;
