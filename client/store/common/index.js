import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"



const initialState = {
    isLoading: false,
    featureImagesList: [],
}

 export const getFeatureImages = createAsyncThunk(
    "/common/getFeatureImages",
    async()=> {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/common/feature/get`)

        return response.data
    }
)

export const addFeatureImages = createAsyncThunk(
    "/common/addFeatureImages",
    async(image)=> {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/common/feature/add`,
    { image }  
        )

        return response.data
    }
)

export const deleteFeatureImages = createAsyncThunk(
    "/common/deleteFeatureImages"
,
async(id)=> {
    const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/common/feature/delete/${id}`

    )
    return response.data
}
)

const featureImageSlice = createSlice({
    name: "featureImageSlice",
    initialState,
    reducers: {},
    extraReducers: (builder)=> {
        builder.addCase(getFeatureImages.pending, (state)=> {
            state.isLoading = true;

        }).addCase(getFeatureImages.fulfilled, (state, action)=> {
            state.isLoading = false,
            state.featureImagesList = action.payload.data;
        }).addCase(getFeatureImages.rejected, (state, action)=> {
            state.isLoading = false;
            state.featureImagesList = []
        })
    }

})


export default featureImageSlice.reducer;