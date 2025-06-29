

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading: false,
    orderId: null,
    orderDetailsOfCod : null,
    orderListOfCod: [],
    formData: null

}
export const createCodOrder = createAsyncThunk(
    "/createCodOrder/create",
    async (orderData) => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shop/codorder/createCod`,
  
        orderData
      );
      console.log(response.data, "API response in createCode");
      return response.data
    }
  );

export const getAllOrdersByUserOfCod = createAsyncThunk(
    "/getAllOrdersByUserOfCod",
    async (userId) => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/codorder/list/${userId}`
      );
      console.log(response.data, "getAllOrdersByUserOfCod");
  
      return response.data;
    }
  );
  export const getOrderDetailsOfCod = createAsyncThunk(
    "/getOrderDetailsOfCod",
    async (id) => {
      console.log(id,"id passed to api before calling")
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/codorder/order/${id}`
      );
      
      return response.data;
    }
  );

const codOrderSlice = createSlice({
    name: "codOrderSlice",
    initialState,
    reducers: {
      resetOrderDetailsOfCod: (state)=> {
        state.orderDetailsOfEsewa = null
    }

    },
    extraReducers: 
        (builder) => {
            builder.addCase(createCodOrder.pending,(state)=> {
                state.isLoading = true;
            }).addCase(createCodOrder.fulfilled, (state, action) => {
                state.isLoading= false,
                state.formData = action.payload.data
                console.log(action.payload, "Redux: createCodOrder fulfilled");

            }).addCase(createCodOrder.rejected, (state)=>{
                state.isLoading= false,
                state.formData = null
            })
            builder.addCase(getAllOrdersByUserOfCod.pending,(state)=> {
                state.isLoading = true;
            }).addCase(getAllOrdersByUserOfCod.fulfilled, (state, action) => {
                state.isLoading= false,
                state.orderListOfCod = action.payload.data
            }).addCase(getAllOrdersByUserOfCod.rejected, (state)=>{
                state.isLoading= false,
                state.orderListOfCod = []
            })
            builder.addCase(getOrderDetailsOfCod.pending,(state)=> {
                state.isLoading = true;
            }).addCase(getOrderDetailsOfCod.fulfilled, (state, action) => {
                state.isLoading= false,
                state.orderDetailsOfCod = action.payload.data
            }).addCase(getOrderDetailsOfCod.rejected, (state,action)=>{
                state.isLoading= false,
                state.orderDetailsOfCod = null
            })
        }
    
    })
export const { resetOrderDetailsOfCod} = codOrderSlice.actions;
    export default codOrderSlice.reducer;