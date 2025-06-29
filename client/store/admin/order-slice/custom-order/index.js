import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  customOrderList: [],
};

export const createOrder = createAsyncThunk(
  "/customOrder/createOrder",
  async (formData) => {
    const response = await axios.post(
      `${
        import.meta.env.VITE_API_URL
      }/api/admin/customorders/createCustomOrder`,
      {
        formData,
      }
    );
    return response.data;
  }
);

export const getAllCustomOrders = createAsyncThunk(
  "/customOrder/getAllCustomOrders",
  async () => {
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/api/admin/customorders/getCustomOrders`,
      
    );
    return response.data;
  }
);

export const updateCustomOrder = createAsyncThunk(
  "/customOrder/updateOrder",
  async ({id, formattedData}) => {
      console.log("formDa", formattedData)
    const response = await axios.put(
      `${
        import.meta.env.VITE_API_URL
      }/api/admin/customorders/updateCustomOrder/${id}`,
      
        formattedData,
      
    );
    return response.data;
  }
);

export const deleteCustomOrder = createAsyncThunk(
  "/customOrder/deleteOrder",
  async (id) => {
    const response = await axios.delete(
      `${
        import.meta.env.VITE_API_URL
      }/api/admin/customorders/deleteCustomOrder/${id}`,
      
    );
    return response.data;
  }
);

export const updateCustomOrderStatus = createAsyncThunk(
  "/customOrder/updateOrderStatus",
  async ({id, status}) => {
    const response = await axios.put(
      `${
        import.meta.env.VITE_API_URL
      }/api/admin/customorders/updateCustomOrderStatus/${id}`,
    {
    status
    }
    );
    return response.data;
  }
);

const customOrderSlice = createSlice({
  name: "adminCustomOrderSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        (state.isLoading = false),
          console.log("Redux custom order Fullfilled", action.payload);
      })
      .addCase(createOrder.rejected, (state) => {
        state.isLoading = false;
      })
    
      .addCase(updateCustomOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCustomOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customOrderList = state.customOrderList.map((order) =>
            order._id === action.payload.data._id ? action.payload.data : order
          );
          
      })
      .addCase(updateCustomOrder.rejected, (state) => {
        state.isLoading = false;
      })
 
      .addCase(deleteCustomOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCustomOrder.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(deleteCustomOrder.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getAllCustomOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllCustomOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customOrderList = action.payload.data
      })
      .addCase(getAllCustomOrders.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateCustomOrderStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCustomOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customOrderList = state.customOrderList.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
        
      })
      .addCase(updateCustomOrderStatus.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default customOrderSlice.reducer;
