import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/Sale`;

// 🔄 Fetch all sales
export const fetchSales = createAsyncThunk('sales/fetch', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(apiUrl);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

// ➕ Add a new sale
export const addSale = createAsyncThunk('sales/add', async (sale, { rejectWithValue }) => {
    try {
        const cleanSale = {
            customerId: sale.customerId,
            productId: sale.productId,
            storeId: sale.storeId,
            dateSold: sale.dateSold
        };
        const response = await axios.post(apiUrl, cleanSale);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

// ✏️ Update a sale (returns enriched sale from backend)
export const updateSale = createAsyncThunk('sales/update', async (sale, { rejectWithValue }) => {
    try {
        const cleanSale = {
            id: sale.id,
            customerId: sale.customerId,
            productId: sale.productId,
            storeId: sale.storeId,
            dateSold: sale.dateSold
        };
        const response = await axios.put(`${apiUrl}/${sale.id}`, cleanSale);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

// 🗑️ Delete a sale
export const deleteSale = createAsyncThunk('sales/delete', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${apiUrl}/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

const saleSlice = createSlice({
    name: 'sales',
    initialState: {
        items: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // FETCH
            .addCase(fetchSales.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSales.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchSales.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ADD
            .addCase(addSale.pending, (state) => {
                state.loading = true;
            })
            .addCase(addSale.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload);
            })
            .addCase(addSale.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // UPDATE
            .addCase(updateSale.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateSale.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex(s => s.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = {
                        ...state.items[index],
                        ...action.payload // ✅ replace with flat DTO (with names)
                    };
                }
            })
            .addCase(updateSale.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // DELETE
            .addCase(deleteSale.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteSale.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter(s => s.id !== action.payload);
            })
            .addCase(deleteSale.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default saleSlice.reducer;
