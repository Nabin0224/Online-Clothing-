import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  formData: null,
  isCapture: "",
  orderId: null,
  orderDetailsOfEsewa: null,
  orderListOfEsewa: [],
};

export const createEsewaOrder = createAsyncThunk(
  "/createEsewaOrder/create",
  async (orderData) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/shop/esewaorder/createesewa`,

      orderData
    );
    console.log(response.data, "API response in createEsewaOrder");
    return response.data.data;
  }
);

export const captureEsewaPayment = createAsyncThunk(
  "/createEsewaPayment/create",
  async ({ encodedData, cartId }) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/shop/esewaorder/captureesewa`,
      { encodedData, cartId }
    );
    console.log(response.data, " first response ");
    return response.data;
  }
);
export const verifyEsewaPayment = createAsyncThunk(
  "/verifyEsewaPayment/create",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/esewaorder/verifyesewa`
    );
    console.log(response.data, "second response");
    return response.data;
  }
);
export const getAllOrdersByUserOfEsewa = createAsyncThunk(
  "/getAllOrdersByUserOfEsewa",
  async (userId) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/esewaorder/list/${userId}`
    );
    console.log(response.data, "getAllOrdersByUser");

    return response.data;
  }
);
export const getOrderDetailsOfEsewa = createAsyncThunk(
  "/getOrderDetailsOfEsewa",
  async (id) => {
    console.log(id,"id passed to api before calling")
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/esewaorder/order/${id}`
    );
    
    return response.data;
  }
);

const esewaOrderSlice = createSlice({
  name: "esewaOrderSlice",
  initialState,
  reducers: {
    resetOrderDetailsOfEsewa: (state)=> {
        state.orderDetailsOfEsewa = null
    }
},
  extraReducers: (builder) => {
    builder
      .addCase(createEsewaOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createEsewaOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.formData = action.payload.data;
        console.log(action.payload, "Redux: createEsewaOrder fulfilled");
      })
      .addCase(createEsewaOrder.rejected, (state) => {
        state.isLoading = false;
        state.formData = null;
      })
      .addCase(captureEsewaPayment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(captureEsewaPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderId = action.payload.data;
        sessionStorage.setItem(
          "getCurrentOrderIdOfEsewa",
          JSON.stringify(action.payload.orderId)
        );
      })
      .addCase(captureEsewaPayment.rejected, (state) => {
        state.isLoading = false;
        state.orderId = null;
      })
      .addCase(verifyEsewaPayment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyEsewaPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.verifyDetails = action.payload?.data;
      })
      .addCase(verifyEsewaPayment.rejected, (state) => {
        state.isLoading = false;
        // state.verifyDetails = [];
      })
      .addCase(getAllOrdersByUserOfEsewa.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersByUserOfEsewa.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderListOfEsewa = action.payload.data;
      })
      .addCase(getAllOrdersByUserOfEsewa.rejected, (state, action) => {
        state.isLoading = false, 
        state.orderListOfEsewa = [];
      })
      .addCase(getOrderDetailsOfEsewa.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetailsOfEsewa.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetailsOfEsewa = action.payload.data;
      })
      .addCase(getOrderDetailsOfEsewa.rejected, (state, action) => {
        state.isLoading = false,
        state.orderDetailsOfEsewa = null;
      });
  },
});
export const { resetOrderDetailsOfEsewa} = esewaOrderSlice.actions;
export default esewaOrderSlice.reducer;
