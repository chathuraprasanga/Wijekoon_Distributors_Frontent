import {
    createAsyncThunk,
    createSlice,
    Draft,
    PayloadAction,
} from "@reduxjs/toolkit";
import axiosInstance from "../../interceptors/axiosInterceptor.ts";
import cheques from "../../pages/cheques";

interface InvoiceState {
    invoices: any;
    selectedInvoice: any;
    status: string;
    error: string;
}

const initialState: InvoiceState = {
    invoices: [],
    selectedInvoice: {},
    status: "idle",
    error: "",
};

export const addInvoice = createAsyncThunk(
    "invoice/addInvoice",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/invoices/invoice`,
                payload
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const getInvoices = createAsyncThunk(
    "invoice/getInvoices",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/invoices/invoices`,
                payload
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const getPagedInvoices = createAsyncThunk(
    "invoice/getPagedInvoices",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/invoices/paged-invoices`,
                payload
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const getInvoice = createAsyncThunk(
    "invoice/getInvoice",
    async (id: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                `/invoices/invoice/${id}`
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const updateInvoice = createAsyncThunk(
    "invoice/updateInvoice",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `/invoices/invoice/${payload.id}`,
                payload.values
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const changeStatusInvoice = createAsyncThunk(
    "invoice/changeStatus",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `/invoices/change-status/${payload.id}`,
                payload.values
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const addBulkInvoicePayment = createAsyncThunk(
    "invoice/addBulkInvoicePayment",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/invoices/bulk-invoice-payment`,
                payload
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

const invoiceSlice = createSlice({
    name: "invoice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            addInvoice.fulfilled,
            (_, action: PayloadAction<any>) => {
                return action.payload;
            }
        );
        builder.addCase(
            getInvoices.fulfilled,
            (state: Draft<InvoiceState>, action: PayloadAction<any>) => {
                state.invoices = action.payload.result;
            }
        );
        builder.addCase(
            getPagedInvoices.fulfilled,
            (state: Draft<InvoiceState>, action: PayloadAction<any>) => {
                state.invoices = action.payload.result.response;
            }
        );
        builder.addCase(
            getInvoice.fulfilled,
            (state: Draft<InvoiceState>, action: PayloadAction<any>) => {
                state.selectedInvoice = action.payload.result;
            }
        );
        builder.addCase(
            updateInvoice.fulfilled,
            (state: Draft<InvoiceState>, action: PayloadAction<any>) => {
                state.invoices = state.invoices.map((invoice: any) =>
                    invoice._id === action.payload.result._id
                        ? action.payload.result
                        : cheques
                );
                state.selectedInvoice = null;
            }
        );
        builder.addCase(
            changeStatusInvoice.fulfilled,
            (state: Draft<InvoiceState>, action: PayloadAction<any>) => {
                state.invoices = state.invoices.map((invoice: any) =>
                    invoice._id === action.payload.result._id
                        ? action.payload.result
                        : invoice
                );
                state.selectedInvoice = null;
            }
        );
        builder.addCase(
            addBulkInvoicePayment.fulfilled,
            (_, action: PayloadAction<any>) => {
                return action.payload;
            }
        );
    },
});

export default invoiceSlice.reducer;
