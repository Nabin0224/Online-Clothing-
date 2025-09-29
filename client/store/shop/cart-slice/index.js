
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getGuestId } from "../../../src/utils/constants/guestId";

const initialState = {
  cartItems : JSON.parse(localStorage.getItem("guestCart")) || [],
  isLoading : false
}
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity, color }) => {
    const payload = userId
      ? { userId, productId, quantity, color }
      : { guestId: getGuestId(), productId, quantity, color };
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/shop/cart/add`,
      payload
    );
    return response.data;
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId) => {
    if (userId) {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/cart/get/${userId}`
      );
      return response.data;
    }
    const gid = getGuestId();
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/cart/get/undefined`,
      { params: { guestId: gid } }
    );
    return response.data;
    // if (userId) {
    //   return (await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/cart/get/${userId}`)).data;
    // } else {
    //   const gid = getGuestId();
    //   console.log("guestId by fetch cart", gid)
    //   return (
    //     await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/cart/get`, { params: { guestId: gid } })
    //   ).data;
    // }
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/update-cart",
  async ({ userId, productId, quantity, color }) => {
    const payload = userId
      ? { userId, productId, quantity, color }
      : { guestId: getGuestId(), productId, quantity, color };
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/shop/cart/update-cart`,
      payload
    );
    return response.data;
  }
);

export const deleteCartItems = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId }) => {
    if (userId) {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/shop/cart/delete-cart/${userId}/${productId}`
      );
      return response.data;
    }
    const gid = getGuestId();
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/shop/cart/delete-cart/undefined/${productId}`,
      { params: { guestId: gid } }
    );
    return response.data;
    // if (userId) {
    //   return (await axios.delete(`${API}/cart/delete-cart/${userId}/${productId}`)).data;
    // } else {
    //   const gid = getGuestId();
    //   return (
    //     await axios.delete(`${API}/cart/delete-cart`, { params: { guestId: gid, productId } })
    //   ).data;
    // }
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    addGuestCartItem: (state, action) => {
      const item = action.payload;
      const existing = state.cartItems.find(
        (i) => i.productId === item.productId && i.color === item.color
      );

      if(existing) {
        existing.quantity += item.quantity;
      } else {
        state.cartItems.push({
          productId: item.productId,
          quantity: item.quantity,
          color: item.color,
          price: item.price,
          salePrice: item.salePrice,
          title: item.title,
          image: item.image,   // product thumbnail
        });
    
      }
      localStorage.setItem("guestCart", JSON.stringify(state.cartItems));
    },
    updateGuestCartItem: (state, action) => {
      const { productId, quantity, color } = action.payload;
      const existing = state.cartItems.find(
        (i) => i.productId === productId && i.color === color 
      );

      if(existing) {
        existing.quantity = quantity;
        localStorage.setItem("guestCart", JSON.stringify(state.cartItems))
      }
    },
    deleteGuestCartItem: (state, action) =>{
      const { productId, color } = action.payload;
      state.cartItems = state.cartItems.filter(
        (i) => !(i.productId === productId && i.color === color)
      );

localStorage.setItem("guestCart", JSON.stringify(state.cartItems));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;  // Adjust to access items directly
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;  // Adjust to access items correctly
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;  // Adjust to access items correctly
      })
      .addCase(updateCartQuantity.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(deleteCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;  // Adjust to access items correctly
      })
      .addCase(deleteCartItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      });
  },
});

export const {
  addGuestCartItem,
  updateGuestCartItem,
  deleteGuestCartItem
} = shoppingCartSlice.actions;

export default shoppingCartSlice.reducer;