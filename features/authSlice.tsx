import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    role:''
}

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers: {
        setRole: (state, action) => {
            state.role = action.payload
        },
    }
})

export default authSlice.reducer
export const { setRole } = authSlice.actions
export const getUserRole = (state:any) => state.auth.role  