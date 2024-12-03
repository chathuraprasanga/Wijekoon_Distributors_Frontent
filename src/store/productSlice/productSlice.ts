import {
    createAsyncThunk,
    createSlice,
    Draft,
    PayloadAction,
} from "@reduxjs/toolkit";
import axiosInstance from "../../interceptors/axiosInterceptor.ts";

interface ProductState {
    products: any;
    selectedProduct: any;
    status: string;
    error: string;
}

const initialState: ProductState = {
    products: [],
    selectedProduct: {},
    status: "idle",
    error: "",
};

export const getProducts = createAsyncThunk(
    "product/getProducts",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                "/products/products",
                payload
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const addProduct = createAsyncThunk(
    "product/addProduct",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                "/products/product",
                payload
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const getProduct = createAsyncThunk(
    "product/getProduct",
    async (id: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                `/products/product/${id}`
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

export const updateProduct = createAsyncThunk(
    "product/updateProduct",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `/products/product/${payload.id}`, payload.values
            );
            return response.data;
        } catch (err: any) {
            throw rejectWithValue(err.response.data);
        }
    }
);

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            getProducts.fulfilled,
            (state: Draft<ProductState>, action: PayloadAction<any>) => {
                state.products = action.payload.result;
            }
        );
        builder.addCase(
            addProduct.fulfilled,
            (_, action: PayloadAction<any>) => {
                return action.payload;
            }
        );
        builder.addCase(
            getProduct.fulfilled,
            (state: Draft<ProductState>, action: PayloadAction<any>) => {
                state.selectedProduct = action.payload.result;
            }
        )
        builder.addCase(
            updateProduct.fulfilled,
            (state: Draft<ProductState>, action: PayloadAction<any>) => {
                state.products = state.products.map((product: any) =>
                    product._id === action.payload.result._id
                        ? action.payload.result
                        : product
                );
                state.selectedProduct = null;
            }
        )
    },
});

export default productSlice.reducer;
