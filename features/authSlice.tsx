import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    role:'',
    username:''
}

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.role = action.payload.role,
            state.username = action.payload.username
        },
    }
})

export default authSlice.reducer
export const { setUser } = authSlice.actions
export const getUserRole = (state:any) => state.auth.role
export const getUserName = (state:any) => state.auth.username