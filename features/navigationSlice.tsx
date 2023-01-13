import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    navbarOpen: false
}

const navigationSlice = createSlice({
    name:'navigation',
    initialState,
    reducers: {
        toggleNavbar: (state, action) => {
            state.navbarOpen = action.payload
        }
    }
})

export default navigationSlice.reducer
export const { toggleNavbar } = navigationSlice.actions
export const getNavbarStatus = (state:any) => state.navigation.navbarOpen 