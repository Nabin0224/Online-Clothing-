import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  searchResults: [],
  searchOrders: []
};

export const getSearchResults = createAsyncThunk(
  "/shop/getSearchResults",
  async (keyword) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/search/${keyword}`
    );
    return response.data;
  }
);
export const getSearchOrders = createAsyncThunk(
  "/shop/getSearchOrders",
  async (search) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/search/order/${search}`
    );
    return response.data;
  }
);

const searchSlice = createSlice({
  name: "searchSlice",
  initialState,
  reducers: {
    resetSearchResult: (state)=>{
        state.searchResults = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSearchResults.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSearchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.data;
      })
      .addCase(getSearchResults.rejected, (state, action) => {
        state.isLoading = false;
        state.searchResults = [];
      })
      .addCase(getSearchOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSearchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchOrders = action.payload.data;
      })
      .addCase(getSearchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.searchOrders = [];
      });
  },
});

export const {resetSearchResult} = searchSlice.actions;
export default searchSlice.reducer;
