import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState ={
    isLoading: false,
    productList : [],
    productDetails : null
    
}

export const fetchAllFilteredProducts = createAsyncThunk(
    "/products/fetchAllFilteredProducts", async({filterParams, sortParams}) => {
        const query = new URLSearchParams({
            ...filterParams,
            sortBy : sortParams
        })
        console.log(query.toString(), "Query Params");
        const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/products/get?${query}`);
        console.log(result.data, "Data")
        return result?.data; 
    }
);

export const fetchProductDetails = createAsyncThunk(
    "/products/fetchProductDetails", async(id)=> {
        
        const result = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/shop/products/get/${id}`
        )
       
        return result?.data 

    }
)

const ShoppingProductSlice= createSlice({
name: "ShoppingProducts",
initialState,
reducers:{},
extraReducers: (builders) =>{
 builders.addCase(fetchAllFilteredProducts.pending, (state)=>{
    state.isLoading = true;
 })
 .addCase(fetchAllFilteredProducts.fulfilled, (state, action)=>{
    state.isLoading = false;
    state.productList = action.payload?.data
 })
 .addCase(fetchAllFilteredProducts.rejected, (state)=>{
    state.isLoading = false
 }).
 addCase(fetchProductDetails.pending, (state)=>{
    state.isLoading = true;
 })
 .addCase(fetchProductDetails.fulfilled, (state, action)=>{
    state.isLoading = false;
    state.productDetails = action.payload?.data
 })
 .addCase(fetchProductDetails.rejected, (state)=>{
    state.isLoading = false;
    state.productDetails = null
 })
}
});

export default ShoppingProductSlice.reducer;