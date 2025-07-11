import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/Customer`;

// Fetch all customers
export const fetchCustomers = createAsyncThunk('customers/fetch', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(apiUrl);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

// Add a new customer
export const addCustomer = createAsyncThunk('customers/add', async (customer, { rejectWithValue }) => {
    try {
        const response = await axios.post(apiUrl, customer);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

// Update customer (returns updated customer from server)
export const updateCustomer = createAsyncThunk('customers/update', async (customer, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${apiUrl}/${customer.id}`, customer);
        return response.data;  // <-- important to return updated data
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

// Delete customer
export const deleteCustomer = createAsyncThunk('customers/delete', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${apiUrl}/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

const customerSlice = createSlice({
    name: 'customers',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchCustomers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchCustomers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch customers';
            })

            // Add
            .addCase(addCustomer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCustomer.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload);
            })
            .addCase(addCustomer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to add customer';
            })

            // Update
            .addCase(updateCustomer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCustomer.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex(c => c.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;  // updated data from server
                }
            })
            .addCase(updateCustomer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update customer';
            })

            // Delete
            .addCase(deleteCustomer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCustomer.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter(c => c.id !== action.payload);
            })
            .addCase(deleteCustomer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to delete customer';
            });
    }
});

export default customerSlice.reducer;
