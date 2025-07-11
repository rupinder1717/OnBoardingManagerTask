import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/Product`;


export const fetchProducts = createAsyncThunk('products/fetch', async () => {
    const response = await axios.get(apiUrl);
    return response.data;
});

export const addProduct = createAsyncThunk('products/add', async (product) => {
    const response = await axios.post(apiUrl, product);
    return response.data;
});

export const updateProduct = createAsyncThunk('products/update', async (product) => {
    await axios.put(`${apiUrl}/${product.id}`, product);
    return product;
});

export const deleteProduct = createAsyncThunk('products/delete', async (id) => {
    await axios.delete(`${apiUrl}/${id}`);
    return id;
});

const productSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.items.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.items = state.items.filter(p => p.id !== action.payload);
            });
    }
});

export default productSlice.reducer;
