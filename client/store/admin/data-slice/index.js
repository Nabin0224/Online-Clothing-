import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const initialState ={
    isLoading: false,
    dailyOrders : []

}

export const fetchDailyOrders = createAsyncThunk("orders/fetchDailyOrders", async()=> {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/ordersdata/daily`)
    return response.data
})

const adminDataSlice = createSlice({
name: "admindata",
initialState,
reducers: {},
extraReducers: (builder) => {
    builder
    .addCase(fetchDailyOrders.pending, (state) => {
        state.isLoading = true
    }).addCase(fetchDailyOrders.fulfilled, (state,action)=> {
        state.isLoading = false;
        state.dailyOrders = action.payload.data
    }).addCase(fetchDailyOrders.rejected, (state,action)=> {
        state.isLoading = false,
        state.dailyOrders = []
    })
}
})

export default adminDataSlice.reducer;