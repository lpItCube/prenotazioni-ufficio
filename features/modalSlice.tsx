import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    modalIsOpen: false,
    modalType:''
}

const modalSlice = createSlice({
    name:'modal',
    initialState,
    reducers: {
        toggleModal: (state, action) => {
            state.modalIsOpen = action.payload
        },
        setModalType: (state, action) => {
            state.modalType = action.payload
        }
    }
})

export default modalSlice.reducer
export const { toggleModal, setModalType } = modalSlice.actions
export const getModalStatus = (state:any) => state.modal.modalIsOpen 
export const getModalType = (state:any) => state.modal.modalType