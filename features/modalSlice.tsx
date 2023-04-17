import { createSlice } from '@reduxjs/toolkit'

interface InitialStateTypes {
    modalIsOpen: boolean,
    modalType: string
}

interface ModalState {
    modal: {
        modalIsOpen: boolean,
        modalType: number
    }
}

const initialState: InitialStateTypes = {
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
export const getModalStatus = (state:ModalState) => state.modal.modalIsOpen 
export const getModalType = (state:ModalState) => state.modal.modalType