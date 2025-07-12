import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/customer`;

// Async Thunks
export const fetchCustomers = createAsyncThunk(
    'customers/fetchCustomers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createCustomer = createAsyncThunk(
    'customers/createCustomer',
    async (customer, { rejectWithValue }) => {
        try {
            const response = await axios.post(API_URL, customer);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateCustomer = createAsyncThunk(
    'customers/updateCustomer',
    async (customer, { rejectWithValue }) => {
        try {
            if (!customer.id) throw new Error("Missing ID for update");
            const response = await axios.put(`${API_URL}/${customer.id}`, customer);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteCustomer = createAsyncThunk(
    'customers/deleteCustomer',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Initial state
const initialState = {
    customers: [],
    loading: false,
    error: null,
    showModal: false,
    showDeleteModal: false,
    modalType: 'create',
    selectedCustomer: null,
};

// Slice
const customerSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {
        setShowModal: (state, action) => {
            state.showModal = action.payload;
        },
        setShowDeleteModal: (state, action) => {
            state.showDeleteModal = action.payload;
        },
        setModalType: (state, action) => {
            state.modalType = action.payload;
        },
        setSelectedCustomer: (state, action) => {
            state.selectedCustomer = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchCustomers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.loading = false;
                state.customers = action.payload;
            })
            .addCase(fetchCustomers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create
            .addCase(createCustomer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCustomer.fulfilled, (state, action) => {
                state.customers.push(action.payload);
                state.loading = false;
            })
            .addCase(createCustomer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update
            .addCase(updateCustomer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCustomer.fulfilled, (state, action) => {
                const idx = state.customers.findIndex(c => c.id === action.payload.id);
                if (idx !== -1) {
                    state.customers[idx] = action.payload;
                }
                state.loading = false;
            })
            .addCase(updateCustomer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete
            .addCase(deleteCustomer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCustomer.fulfilled, (state, action) => {
                state.customers = state.customers.filter(c => c.id !== action.payload);
                state.loading = false;
            })
            .addCase(deleteCustomer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Exports
export const {
    setShowModal,
    setShowDeleteModal,
    setModalType,
    setSelectedCustomer
} = customerSlice.actions;

export default customerSlice.reducer;
