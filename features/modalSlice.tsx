import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    modalIsOpen: false,
}

const modalSlice = createSlice({
    name:'modal',
    initialState,
    reducers: {
        toggleModal: (state, action) => {
            state.modalIsOpen = action.payload
        }
    }
})

export default modalSlice.reducer
export const { toggleModal } = modalSlice.actions
export const getModalStatus = (state:any) => state.modal.modalIsOpen 