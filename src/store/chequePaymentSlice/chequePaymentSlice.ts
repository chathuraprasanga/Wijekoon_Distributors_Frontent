import {
    createAsyncThunk,
    createSlice,
    Draft,
    PayloadAction,
} from "@reduxjs/toolkit";
import axiosInstance from "../../interceptors/axiosInterceptor.ts";

interface ChequePaymentState {
    chequePayments: any;
    selectedChequePayment: any;
    status: string;
    error: string;
}

const initialState: ChequePaymentState = {
    chequePayments: [],
    selectedChequePayment: {},
    status: "idle",
    error: "",
};

export const addChequePayment = createAsyncThunk(
    "chequePayment/addChequePayment",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/cheque-payment/cheque-payment`,
                payload
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const getChequePayments = createAsyncThunk(
    "chequePayment/getChequePayments",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/cheque-payment/cheque-payments`,
                payload
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const getPagedChequePayments = createAsyncThunk(
    "chequePayment/getPagedChequePayments",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/cheque-payment/paged-cheque-payments`,
                payload
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const getChequePayment = createAsyncThunk(
    "chequePayment/getChequePayment",
    async (id: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                `/cheque-payment/cheque-payment/${id}`
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const updateChequePayment = createAsyncThunk(
    "chequePayment/updateChequePayment",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `/cheque-payment/cheque-payment/${payload.id}`,
                payload.values
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const changeStatusChequePayment = createAsyncThunk(
    "chequePayment/changeStatus",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `/cheque-payment/change-status/${payload.id}`,
                payload.values
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

const chequePaymentSlice = createSlice({
    name: "chequePayment",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            addChequePayment.fulfilled,
            (_, action: PayloadAction<any>) => {
                return action.payload;
            }
        );
        builder.addCase(
            getChequePayments.fulfilled,
            (state: Draft<ChequePaymentState>, action: PayloadAction<any>) => {
                state.chequePayments = action.payload.result;
            }
        );
        builder.addCase(
            getPagedChequePayments.fulfilled,
            (state: Draft<ChequePaymentState>, action: PayloadAction<any>) => {
                state.chequePayments = action.payload.result.response;
            }
        );
        builder.addCase(
            getChequePayment.fulfilled,
            (state: Draft<ChequePaymentState>, action: PayloadAction<any>) => {
                state.selectedChequePayment = action.payload.result;
            }
        );
        builder.addCase(
            updateChequePayment.fulfilled,
            (state: Draft<ChequePaymentState>, action: PayloadAction<any>) => {
                state.chequePayments = state.chequePayments.map((cheques: any) =>
                    cheques._id === action.payload.result._id
                        ? action.payload.result
                        : cheques
                );
                state.selectedChequePayment = null;
            }
        );
        builder.addCase(
            changeStatusChequePayment.fulfilled,
            (state: Draft<ChequePaymentState>, action: PayloadAction<any>) => {
                state.chequePayments = state.chequePayments.map((cheque: any) =>
                    cheque._id === action.payload.result._id
                        ? action.payload.result
                        : cheque
                );
                state.selectedChequePayment = null;
            }
        );
    },
});

export default chequePaymentSlice.reducer;
