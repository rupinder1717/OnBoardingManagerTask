import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/store`;

// Async Thunks
export const fetchStores = createAsyncThunk('stores/fetchStores', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const createStore = createAsyncThunk('stores/createStore', async (store, { rejectWithValue }) => {
    try {
        const response = await axios.post(API_URL, store);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const updateStore = createAsyncThunk('stores/updateStore', async (store, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/${store.id}`, store);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const deleteStore = createAsyncThunk('stores/deleteStore', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

// Initial State
const initialState = {
    stores: [],
    showModal: false,
    showDeleteModal: false,
    modalType: 'create',
    selectedStore: null,
    loading: false,
    error: null,
};

const storeSlice = createSlice({
    name: 'stores',
    initialState,
    reducers: {
        setShowModal: (state, action) => { state.showModal = action.payload; },
        setShowDeleteModal: (state, action) => { state.showDeleteModal = action.payload; },
        setModalType: (state, action) => { state.modalType = action.payload; },
        setSelectedStore: (state, action) => { state.selectedStore = action.payload; },
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchStores.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStores.fulfilled, (state, action) => {
                state.loading = false;
                state.stores = action.payload;
            })
            .addCase(fetchStores.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create
            .addCase(createStore.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createStore.fulfilled, (state, action) => {
                state.stores.push(action.payload);
                state.loading = false;
            })
            .addCase(createStore.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update
            .addCase(updateStore.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateStore.fulfilled, (state, action) => {
                const index = state.stores.findIndex(s => s.id === action.payload.id);
                if (index !== -1) state.stores[index] = action.payload;
                state.loading = false;
            })
            .addCase(updateStore.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete
            .addCase(deleteStore.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteStore.fulfilled, (state, action) => {
                state.stores = state.stores.filter(s => s.id !== action.payload);
                state.loading = false;
            })
            .addCase(deleteStore.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

// Export Actions and Reducer
export const { setShowModal, setShowDeleteModal, setModalType, setSelectedStore } = storeSlice.actions;
export default storeSlice.reducer;
