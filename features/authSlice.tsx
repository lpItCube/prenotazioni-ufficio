import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    role:'',
    username:'',
    userId:''
}

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.role = action.payload.role,
            state.username = action.payload.username,
            state.userId = action.payload.userId
        },
    }
})

export default authSlice.reducer
export const { setUser } = authSlice.actions
export const getUserRole = (state:any) => state.auth.role
export const getUserName = (state:any) => state.auth.username
export const getUserId = (state:any) => state.auth.userId