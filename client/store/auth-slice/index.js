import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import axios from "axios";

//Initial state of authentication...
const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};


// Async thunk for registerUser

const registerUser = createAsyncThunk("auth/register", async (data) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/auth/register`,
    data,
    {
      withCredentials: true,
    }
  );
  return response.data;
});

//Async thunk for loginUser
const loginUser = createAsyncThunk("auth/login", async (data) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/auth/login`,
    data,
    {
      withCredentials: true,
    }
  );
  return response.data;
});

//Async thunk for checking authentication for every refresh

const checkAuth = createAsyncThunk("/auth/check-auth", async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/auth/check-auth`,
    {
      withCredentials: true,
    }
  );
  return response.data;
});

//Async thunk for logout 
const logOut = createAsyncThunk("auth/logout", async () => {
  // Optional: Send request to your server to handle logout (e.g., invalidate token)
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/auth/logout`, // Update with your API URL if necessary
    {},
    {
      withCredentials: true,
    }
  );

  return response.data;
});


export const checkGoogleAuth = createAsyncThunk("auth/checkAuth", async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/google/checkGoogleAuth`,
    { withCredentials: true }
  );
  return response.data
});

//Slicing and reducers with extra reducers

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logOut.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logOut.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logOut.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkGoogleAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkGoogleAuth.fulfilled, (state, action) => {
        console.log("payload in checkauth google", action.payload)
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = true
      })
      .addCase(checkGoogleAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
export { registerUser, loginUser, checkAuth, logOut };
