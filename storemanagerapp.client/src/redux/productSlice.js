import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/product`;

// Async Thunks
export const fetchProducts = createAsyncThunk(
    'products/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const createProduct = createAsyncThunk(
    'products/create',
    async (product, { rejectWithValue }) => {
        try {
            const response = await axios.post(API_URL, product);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const updateProduct = createAsyncThunk(
    'products/update',
    async (product, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/${product.id}`, product);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const deleteProduct = createAsyncThunk(
    'products/delete',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Initial State
const initialState = {
    products: [],
    showModal: false,
    showDeleteModal: false,
    modalType: 'create',
    selectedProduct: null,
    loading: false,
    error: null,
};

// Slice
const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setShowModal: (state, action) => { state.showModal = action.payload; },
        setShowDeleteModal: (state, action) => { state.showDeleteModal = action.payload; },
        setModalType: (state, action) => { state.modalType = action.payload; },
        setSelectedProduct: (state, action) => { state.selectedProduct = action.payload; },
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.products = action.payload;
                state.loading = false;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.products.push(action.payload);
                state.loading = false;
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.products.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
                state.loading = false;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter(p => p.id !== action.payload);
                state.loading = false;
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

// Export actions & reducer
export const {
    setShowModal,
    setShowDeleteModal,
    setModalType,
    setSelectedProduct
} = productSlice.actions;

export default productSlice.reducer;
