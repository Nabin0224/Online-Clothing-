import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  addressList: [],
};

export const addNewAddress = createAsyncThunk(
  "/address/addToAddress",
  async (formData) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/shop/address/add`,

      formData
    );
   
    return response.data;
  }
);

export const fetchAllAddress = createAsyncThunk(
  "/address/fetchAllAddress",
  async (userId) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/address/fetch/${userId}`
    );
    return response.data;
  }
);

export const editAddress = createAsyncThunk(
  "/address/editAddress",
  async ({userId, addressId, formData}) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/shop/address/edit/${userId}/${addressId}`,
      formData
    );
    return response.data;
  }
);

export const deleteAddress = createAsyncThunk(
  "/address/delete",
  async ({userId, addressId}) => {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/shop/address/delete/${userId}/${addressId}`
    );
    return response.data;
  }
);

const shoppingAddressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewAddress.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(addNewAddress.rejected, (state, ) => {
        state.isLoading = false
      })
      .addCase(fetchAllAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllAddress.fulfilled, (state, action) => {
        state.isLoading = false,
        state.addressList = action.payload.data
      })
      .addCase(fetchAllAddress.rejected, (state, action) => {
         state.isLoading = false,
         state.addressList = []
       })
    //   .addCase(editAddress.pending, (state) => {
    //     state.isLoading = true;
    //   })
    //   .addCase(editAddress.fulfilled, (state, action) => {
    //     state.isLoading = false,
    //     state.addressList = action.payload?.data
    //   })
    //   .addCase(editAddress.rejected, (state, action) => {
    //     state.isLoading = false
    //       , state.addressList = []
    //   })
    //   .addCase(deleteAddress.pending, (state) => {
    //      state.isLoading = true;
    //    })
    //    .addCase(deleteAddress.fulfilled, (state, action) => {
    //      state.isLoading = false;
    //      state.addressList = action.payload.data
    //   })
    //    .addCase(deleteAddress.rejected, (state, action) => {
    //    state.isLoading = false
    //  });
  },
});

export default shoppingAddressSlice.reducer;
