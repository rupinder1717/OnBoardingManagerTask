import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}/sale`; // ✅ FIXED (removed duplicate /api)

// Async Thunks for Sale CRUD
export const fetchSale = createAsyncThunk('sale/fetchSale', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(API_URL);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const createSale = createAsyncThunk('sale/createSale', async (sale, { rejectWithValue }) => {
    try {
        const res = await axios.post(API_URL, sale);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const updateSale = createAsyncThunk('sale/updateSale', async (sale, { rejectWithValue }) => {
    try {
        const res = await axios.put(`${API_URL}/${sale.id}`, sale);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const deleteSale = createAsyncThunk('sale/deleteSale', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

// Dropdown Data
export const fetchCustomers = createAsyncThunk('sale/fetchCustomers', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${BASE_URL}/customer`); // ✅ FIXED
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const fetchProducts = createAsyncThunk('sale/fetchProducts', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${BASE_URL}/product`); // ✅ FIXED
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const fetchStores = createAsyncThunk('sale/fetchStores', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${BASE_URL}/store`); // ✅ FIXED
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

// Slice
const saleSlice = createSlice({
    name: 'sale',
    initialState: {
        sale: [],
        customers: [],
        products: [],
        stores: [],
        showModal: false,
        modalType: 'create',
        selectedSale: null,
        showDeleteModal: false,
        loading: false,
        error: null,
    },
    reducers: {
        setShowModal: (state, action) => { state.showModal = action.payload; },
        setModalType: (state, action) => { state.modalType = action.payload; },
        setSelectedSale: (state, action) => { state.selectedSale = action.payload; },
        setShowDeleteModal: (state, action) => { state.showDeleteModal = action.payload; },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Sale
            .addCase(fetchSale.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSale.fulfilled, (state, action) => {
                state.loading = false;
                state.sale = action.payload;
            })
            .addCase(fetchSale.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create
            .addCase(createSale.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSale.fulfilled, (state, action) => {
                state.sale.push(action.payload);
                state.loading = false;
            })
            .addCase(createSale.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update
            .addCase(updateSale.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSale.fulfilled, (state, action) => {
                const idx = state.sale.findIndex(s => s.id === action.payload.id);
                if (idx !== -1) state.sale[idx] = action.payload;
                state.loading = false;
            })
            .addCase(updateSale.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete
            .addCase(deleteSale.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteSale.fulfilled, (state, action) => {
                state.sale = state.sale.filter(s => s.id !== action.payload);
                state.loading = false;
            })
            .addCase(deleteSale.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Dropdowns
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.customers = action.payload;
            })
            .addCase(fetchCustomers.rejected, (state, action) => {
                state.error = action.payload;
            })

            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.error = action.payload;
            })

            .addCase(fetchStores.fulfilled, (state, action) => {
                state.stores = action.payload;
            })
            .addCase(fetchStores.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

export const {
    setShowModal,
    setModalType,
    setSelectedSale,
    setShowDeleteModal
} = saleSlice.actions;

export default saleSlice.reducer;
