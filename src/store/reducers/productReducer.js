import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Acción para eliminar un producto
export const delete_product = createAsyncThunk('product/delete', async (productId, thunkAPI) => {
    try {
        const response = await axios.delete(`/api/product-delete/${productId}`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
        totalProduct: 0,
        successMessage: '',
        errorMessage: '',
        loader: false,
    },
    reducers: {
        messageClear: (state) => {
            state.successMessage = '';
            state.errorMessage = '';
        },
    },
    extraReducers: {
        // ... otros casos
        [delete_product.fulfilled]: (state, action) => {
            state.successMessage = action.payload.message;
            state.loader = false;
        },
        [delete_product.rejected]: (state, action) => {
            state.errorMessage = action.payload.error;
            state.loader = false;
        },
    }
});

export const { messageClear } = productSlice.actions;
export default productSlice.reducer;
