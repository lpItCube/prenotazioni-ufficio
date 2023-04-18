import { createSlice } from '@reduxjs/toolkit'

interface InitialState {
    navbarOpen: boolean
}

const initialState: InitialState = {
    navbarOpen: false,
}

interface StateNavigation {
    navigation: {
        navbarOpen: boolean
    }
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
export const getNavbarStatus = (state:StateNavigation) => state.navigation.navbarOpen 