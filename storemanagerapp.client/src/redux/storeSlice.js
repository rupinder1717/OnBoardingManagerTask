import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/Store`;

// 🔄 Fetch stores
export const fetchStores = createAsyncThunk(
    'stores/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(apiUrl);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// ➕ Add store
export const addStore = createAsyncThunk(
    'stores/add',
    async (store, { rejectWithValue }) => {
        try {
            const response = await axios.post(apiUrl, store);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// ✏️ Update store
export const updateStore = createAsyncThunk(
    'stores/update',
    async (store, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${apiUrl}/${store.id}`, store);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// 🗑️ Delete store
export const deleteStore = createAsyncThunk(
    'stores/delete',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${apiUrl}/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// 🧠 Slice
const storeSlice = createSlice({
    name: 'stores',
    initialState: {
        items: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // 🔄 Fetch
            .addCase(fetchStores.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStores.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchStores.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ➕ Add
            .addCase(addStore.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addStore.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload);
            })
            .addCase(addStore.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✏️ Update
            .addCase(updateStore.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateStore.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex(s => s.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateStore.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 🗑️ Delete
            .addCase(deleteStore.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteStore.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter(s => s.id !== action.payload);
            })
            .addCase(deleteStore.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default storeSlice.reducer;
