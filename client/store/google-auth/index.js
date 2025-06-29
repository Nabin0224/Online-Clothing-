// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// const initialState =  { 
//    user: null,
//   isLoading: true,
//   isAuthenticated: false
// }

// // Check if user is logged in
// export const checkAuth = createAsyncThunk("auth/checkAuth", async () => {
//   const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/google/google`);
//   return response.data
// });

// // // Handle OAuth Callback (when Google redirects back)
// // export const checkAuthCallback = createAsyncThunk("auth/checkAuthCallback", async () => {
// //   const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/google/callback`, { withCredentials: true });
// //   return response.data;
// // });

// // // Logout user
// // export const logout = createAsyncThunk("auth/logout", async () => {
// //   const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/google/logout`, { withCredentials: true });
// //   return response.data;
// // });

// const googleAuthSlice = createSlice({
//   name: "googleAuth",
//   initialState,
  
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(checkAuth.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(checkAuth.fulfilled, (state, action) => {
//         state.isLoading = false;
//         // state.user = action.payload.data;
//       })
//       .addCase(checkAuth.rejected, (state, action) => {
//         state.isLoading = false;
//       })

//   },
// });

// export default googleAuthSlice.reducer;