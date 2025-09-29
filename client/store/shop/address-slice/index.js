import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  addressList: [],
};

// ✅ Utility: Always send userId or guestId
function buildAddressPayload(userId, guestId, formData) {
  return {
    ...formData,
    userId: userId || undefined,
    guestId: !userId ? guestId : undefined,
  };
}

export const addNewAddress = createAsyncThunk(
  "/address/addToAddress",
  async ({ userId, guestId, formData }) => {
    const payload = buildAddressPayload(userId, guestId, formData);
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/shop/address/add`,
      payload
    );
    return response.data;
  }
);

export const fetchAllAddress = createAsyncThunk(
  "/address/fetchAllAddress",
  async ({ userId, guestId }) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/address/fetch/${userId || "undefined"}`,
      { params: { guestId } }
    );
    return response.data;
  }
);

export const editAddress = createAsyncThunk(
  "/address/editAddress",
  async ({ userId, guestId, addressId, formData }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/shop/address/edit/${userId || "undefined"}/${addressId}`,
      formData,
      { params: { guestId } }
    );
    return response.data;
  }
);

export const deleteAddress = createAsyncThunk(
  "/address/delete",
  async ({ userId, guestId, addressId }) => {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/shop/address/delete/${userId || "undefined"}/${addressId}`,
      { params: { guestId } }
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
      // add
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewAddress.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addNewAddress.rejected, (state) => {
        state.isLoading = false;
      })

      // fetch
      .addCase(fetchAllAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data || [];
      })
      .addCase(fetchAllAddress.rejected, (state) => {
        state.isLoading = false;
        state.addressList = [];
      })

      // edit
      .addCase(editAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update addressList directly
        const updated = action.payload.data;
        state.addressList = state.addressList.map((a) =>
          a._id === updated._id ? updated : a
        );
      })
      .addCase(editAddress.rejected, (state) => {
        state.isLoading = false;
      })

      // delete
      .addCase(deleteAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = state.addressList.filter(
          (a) => a._id !== action.meta.arg.addressId
        );
      })
      .addCase(deleteAddress.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default shoppingAddressSlice.reducer;
