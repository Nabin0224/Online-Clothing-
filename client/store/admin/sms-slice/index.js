import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const initialState ={
    isLoading: false,
    data: null
}

export const sendSms = createAsyncThunk("/sendSms", async ({ to, text }) => {
  const response = await  axios.post(
    `${import.meta.env.VITE_API_URL}/api/admin/sms/sendSms`,
    {
      to,
      text,
    }
  );
  console.log(response.data, "API response in sendSms");
  return response.data;
});

const smsSlice = createSlice({
    name: "smsSlice",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(sendSms.pending, (state)=> {
            state.isLoading= true
        }).addCase(sendSms.fulfilled, (state, action)=> {
            state.isLoading = false,
            state.data = action.payload.data
        }).addCase(sendSms.rejected, (state, action)=> {
            state.isLoading = false,
            state.data = null
        })
    }
})

export default smsSlice.reducer;