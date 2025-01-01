import {
    createAsyncThunk,
    createSlice,
    Draft,
    PayloadAction,
} from "@reduxjs/toolkit";
import axiosInstance from "../../interceptors/axiosInterceptor.ts";

interface BankDetailState {
    bankDetails: any;
    selectedBankDetail: any;
    status: string;
    error: string;
}

const initialState: BankDetailState = {
    bankDetails: [],
    selectedBankDetail: {},
    status: "idle",
    error: "",
};

export const addBankDetail = createAsyncThunk(
    "bankDetail/addBankDetail",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/bank-details/bank-detail`,
                payload
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const getBankDetails = createAsyncThunk(
    "bankDetail/getBankDetails",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/bank-details/bank-details`,
                payload
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const getBankDetail = createAsyncThunk(
    "bankDetail/getBankDetail",
    async (id: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                `/bank-details/bank-detail/${id}`
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const updateBankDetail = createAsyncThunk(
    "bankDetail/updateBankDetail",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `/bank-details/bank-detail/${payload.id}`,
                payload.values
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const changeStatusBankDetail = createAsyncThunk(
    "user/changeStatusBankDetail",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `/bank-details/change-status/${payload.id}`,
                payload.values
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

const bankDetailSlice = createSlice({
    name: "bankDetail",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            addBankDetail.fulfilled,
            (_, action: PayloadAction<any>) => {
                return action.payload;
            }
        );
        builder.addCase(
            getBankDetails.fulfilled,
            (state: Draft<BankDetailState>, action: PayloadAction<any>) => {
                state.bankDetails = action.payload.result;
            }
        );
        builder.addCase(
            getBankDetail.fulfilled,
            (state: Draft<BankDetailState>, action: PayloadAction<any>) => {
                state.selectedBankDetail = action.payload.result;
            }
        );
        builder.addCase(
            updateBankDetail.fulfilled,
            (state: Draft<BankDetailState>, action: PayloadAction<any>) => {
                state.bankDetails = state.bankDetails.map((supplier: any) =>
                    supplier._id === action.payload.result._id
                        ? action.payload.result
                        : supplier
                );
                state.selectedBankDetail = null;
            }
        );
        builder.addCase(
            changeStatusBankDetail.fulfilled,
            (state: Draft<BankDetailState>, action: PayloadAction<any>) => {
                state.bankDetails = state.bankDetails.map((supplier: any) =>
                    supplier._id === action.payload.result._id
                        ? action.payload.result
                        : supplier
                );
                state.selectedBankDetail = null;
            }
        );
    },
});

export default bankDetailSlice.reducer;
