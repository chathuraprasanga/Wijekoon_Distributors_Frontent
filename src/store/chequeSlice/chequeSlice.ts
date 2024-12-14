import {
    createAsyncThunk,
    createSlice,
    Draft,
    PayloadAction,
} from "@reduxjs/toolkit";
import axiosInstance from "../../interceptors/axiosInterceptor.ts";

interface ChequeState {
    cheques: any;
    selectedCheque: any;
    status: string;
    error: string;
}

const initialState: ChequeState = {
    cheques: [],
    selectedCheque: {},
    status: "idle",
    error: "",
};

export const addCheque = createAsyncThunk(
    "cheque/addCheque",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/cheques/cheque`,
                payload
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const getCheques = createAsyncThunk(
    "cheque/getCheques",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/cheques/cheques`,
                payload
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const getPagedCheques = createAsyncThunk(
    "cheque/getPagedCheques",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/cheques/paged-cheques`,
                payload
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const getCheque = createAsyncThunk(
    "cheque/getCheque",
    async (id: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                `/cheques/cheque/${id}`
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const updateCheque = createAsyncThunk(
    "cheque/updateCheque",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `/cheques/cheque/${payload.id}`,
                payload.values
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const changeStatusCheque = createAsyncThunk(
    "cheque/changeStatus",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `/cheques/change-status/${payload.id}`,
                payload.values
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

const chequeSlice = createSlice({
    name: "cheque",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            addCheque.fulfilled,
            (_, action: PayloadAction<any>) => {
                return action.payload;
            }
        );
        builder.addCase(
            getCheques.fulfilled,
            (state: Draft<ChequeState>, action: PayloadAction<any>) => {
                state.cheques = action.payload.result;
            }
        );
        builder.addCase(
            getPagedCheques.fulfilled,
            (state: Draft<ChequeState>, action: PayloadAction<any>) => {
                state.cheques = action.payload.result.response;
            }
        );
        builder.addCase(
            getCheque.fulfilled,
            (state: Draft<ChequeState>, action: PayloadAction<any>) => {
                state.selectedCheque = action.payload.result;
            }
        );
        builder.addCase(
            updateCheque.fulfilled,
            (state: Draft<ChequeState>, action: PayloadAction<any>) => {
                state.cheques = state.cheques.map((cheques: any) =>
                    cheques._id === action.payload.result._id
                        ? action.payload.result
                        : cheques
                );
                state.selectedCheque = null;
            }
        );
        builder.addCase(
            changeStatusCheque.fulfilled,
            (state: Draft<ChequeState>, action: PayloadAction<any>) => {
                state.cheques = state.cheques.map((cheque: any) =>
                    cheque._id === action.payload.result._id
                        ? action.payload.result
                        : cheque
                );
                state.selectedCheque = null;
            }
        );
    },
});

export default chequeSlice.reducer;
