import {
    createAsyncThunk,
    createSlice,
    Draft,
    PayloadAction,
} from "@reduxjs/toolkit";
import axiosInstance from "../../interceptors/axiosInterceptor.ts";

interface VehicleState {
    vehicles: any;
    selectedVehicle: any;
    status: string;
    error: string;
}

const initialState: VehicleState = {
    vehicles: [],
    selectedVehicle: {},
    status: "idle",
    error: "",
};

export const addVehicle = createAsyncThunk(
    "vehicle/addVehicle",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/vehicles/vehicle`,
                payload
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const getVehicles = createAsyncThunk(
    "vehicle/getVehicles",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/vehicles/vehicles`,
                payload
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const getVehicle = createAsyncThunk(
    "vehicle/getVehicle",
    async (id: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                `/vehicles/vehicle/${id}`
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const updateVehicle = createAsyncThunk(
    "vehicle/updateVehicle",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `/vehicles/vehicle/${payload.id}`,
                payload.values
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const getPagedVehicles = createAsyncThunk(
    "vehicle/getPagedVehicles",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `/vehicles/paged-vehicles`,
                payload
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

const vehicleSlice = createSlice({
    name: "vehicle",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            addVehicle.fulfilled,
            (_, action: PayloadAction<any>) => {
                return action.payload;
            }
        );
        builder.addCase(
            getVehicles.fulfilled,
            (state: Draft<VehicleState>, action: PayloadAction<any>) => {
                state.vehicles = action.payload.result;
            }
        );
        builder.addCase(
            getVehicle.fulfilled,
            (state: Draft<VehicleState>, action: PayloadAction<any>) => {
                state.selectedVehicle = action.payload.result;
            }
        );
        builder.addCase(
            updateVehicle.fulfilled,
            (state: Draft<VehicleState>, action: PayloadAction<any>) => {
                state.vehicles = state.vehicles.map((v: any) =>
                    v._id === action.payload.result._id
                        ? action.payload.result
                        : v
                );
                state.selectedVehicle = null;
            }
        );
        builder.addCase(
            getPagedVehicles.fulfilled,
            (state: Draft<VehicleState>, action: PayloadAction<any>) => {
                state.vehicles = action.payload.result.response;
            }
        );
    },
});

export default vehicleSlice.reducer;
