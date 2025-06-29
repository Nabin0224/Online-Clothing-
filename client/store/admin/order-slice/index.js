import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
  orderList: [],
  orderDetails: null,
  totalOrders: '',
  totalPages: ''
};

export const getAllOrdersForAdmin = createAsyncThunk(
  "/order/getAllOrdersForAdmin",
  async (page = 1) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/admin/orders/get?page=${page}`
    );
    return response.data;
  }
);

export const getOrderDetailsForAdmin = createAsyncThunk(
  "/order/getOrderDetailsForAdmin",
  async (id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/admin/orders/details/${id}`
    );
    return response.data;
  }
);

export const getUpdatedOrderStatus = createAsyncThunk("/order/getUpdatedOrderStatus", async({id, status})=> {
 const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/orders/update/${id}`,
  {
    status
  }
 )
 return response.data  
})

const adminOrderSlice = createSlice({
  name: "adminOrderSlice",
  initialState,
  reducers: { 
    resetOrderDetails : ((state) => {
      state.orderDetails = null;
    } )
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
        state.totalPages = action.payload.totalPages; // Store total pages
        state.currentPage = action.payload.currentPage; // Store current page
      })
      .addCase(getAllOrdersForAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
        console.log("REdux fullfull in admin details", action.payload)
      })
      .addCase(getOrderDetailsForAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export const { resetOrderDetails} = adminOrderSlice.actions;
export default adminOrderSlice.reducer;
