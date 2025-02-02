import {
    createAsyncThunk,
    createSlice,
    Draft,
    PayloadAction,
} from "@reduxjs/toolkit";
import axiosInstance from "../../interceptors/axiosInterceptor.ts";

interface SalesRecordState {
    salesRecords: any;
    selectedSalesRecord: any;
    status: string;
    error: string;
}

const initialState: SalesRecordState = {
    salesRecords: [],
    selectedSalesRecord: {},
    status: "idle",
    error: "",
};

export const addSalesRecord = createAsyncThunk(
    "salesRecord/addSalesRecord",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/sales-records/sales-record`,
                payload
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const getSalesRecords = createAsyncThunk(
    "salesRecord/getSalesRecords",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/sales-records/sales-records`,
                payload
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const getPagedSalesRecords = createAsyncThunk(
    "salesRecord/getPagedSalesRecords",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/sales-records/paged-sales-records`,
                payload
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const getSalesRecord = createAsyncThunk(
    "salesRecord/getSalesRecord",
    async (id: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                `/sales-records/sales-record/${id}`
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const updateSalesRecord = createAsyncThunk(
    "salesRecord/updateSalesRecord",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `/sales-records/sales-record/${payload.id}`,
                payload.values
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const changeStatusSalesRecord = createAsyncThunk(
    "salesRecord/changeStatus",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `/sales-records/change-status/${payload.id}`,
                payload.values
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

const salesRecordSlice = createSlice({
    name: "salesRecord",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            addSalesRecord.fulfilled,
            (_, action: PayloadAction<any>) => {
                return action.payload;
            }
        );
        builder.addCase(
            getSalesRecords.fulfilled,
            (state: Draft<SalesRecordState>, action: PayloadAction<any>) => {
                state.salesRecords = action.payload.result;
            }
        );
        builder.addCase(
            getPagedSalesRecords.fulfilled,
            (state: Draft<SalesRecordState>, action: PayloadAction<any>) => {
                state.salesRecords = action.payload.result.response;
            }
        );
        builder.addCase(
            getSalesRecord.fulfilled,
            (state: Draft<SalesRecordState>, action: PayloadAction<any>) => {
                state.selectedSalesRecord = action.payload.result;
            }
        );
        builder.addCase(
            updateSalesRecord.fulfilled,
            (state: Draft<SalesRecordState>, action: PayloadAction<any>) => {
                state.salesRecords = state.salesRecords.map((salesRecord: any) =>
                    salesRecord._id === action.payload.result._id
                        ? action.payload.result
                        : salesRecord
                );
                state.selectedSalesRecord = null;
            }
        );
        builder.addCase(
            changeStatusSalesRecord.fulfilled,
            (state: Draft<SalesRecordState>, action: PayloadAction<any>) => {
                state.salesRecords = state.salesRecords.map((salesRecord: any) =>
                    salesRecord._id === action.payload.result._id
                        ? action.payload.result
                        : salesRecord
                );
                state.selectedSalesRecord = null;
            }
        );
    },
});

export default salesRecordSlice.reducer;
