import {
    createAsyncThunk,
    createSlice,
    Draft,
    PayloadAction,
} from "@reduxjs/toolkit";
import axiosInstance from "../../interceptors/axiosInterceptor.ts";

interface SupplierState {
    suppliers: any;
    selectedSupplier: any;
    status: string;
    error: string;
}

const initialState: SupplierState = {
    suppliers: [],
    selectedSupplier: {},
    status: "idle",
    error: "",
};

export const addSupplier = createAsyncThunk(
    "supplier/addSupplier",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/suppliers/supplier`,
                payload
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const getSuppliers = createAsyncThunk(
    "supplier/getSuppliers",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/suppliers/suppliers`,
                payload
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const getSupplier = createAsyncThunk(
    "supplier/getSupplier",
    async (id: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                `/suppliers/supplier/${id}`
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const updateSupplier = createAsyncThunk(
    "supplier/updateSupplier",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `/suppliers/supplier/${payload.id}`,
                payload.values
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const changeStatusSupplier = createAsyncThunk(
    "supplier/changeStatus",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `/suppliers/change-status/${payload.id}`,
                payload.values
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

const supplierSlice = createSlice({
    name: "supplier",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            addSupplier.fulfilled,
            (_, action: PayloadAction<any>) => {
                return action.payload;
            }
        );
        builder.addCase(
            getSuppliers.fulfilled,
            (state: Draft<SupplierState>, action: PayloadAction<any>) => {
                state.suppliers = action.payload.result;
            }
        );
        builder.addCase(
            getSupplier.fulfilled,
            (state: Draft<SupplierState>, action: PayloadAction<any>) => {
                state.selectedSupplier = action.payload.result;
            }
        );
        builder.addCase(
            updateSupplier.fulfilled,
            (state: Draft<SupplierState>, action: PayloadAction<any>) => {
                state.suppliers = state.suppliers.map((supplier: any) =>
                    supplier._id === action.payload.result._id
                        ? action.payload.result
                        : supplier
                );
                state.selectedSupplier = null;
            }
        );
        builder.addCase(
            changeStatusSupplier.fulfilled,
            (state: Draft<SupplierState>, action: PayloadAction<any>) => {
                state.suppliers = state.suppliers.map((supplier: any) =>
                    supplier._id === action.payload.result._id
                        ? action.payload.result
                        : supplier
                );
                state.selectedSupplier = null;
            }
        );
    },
});

export default supplierSlice.reducer;
