import { uiCloseModal, uiOpenModal } from "../../actions/ui";
import { uiReducer } from "../../reducers/uiReducer"
import { types } from "../../types/types";



const initialState = {
    modalOpen: false,
}

describe('uiReducer', () => {
    
    test('retornar initialState', () => {
        
        const state = uiReducer(initialState, {});
        // console.log(state);
        expect( state ).toEqual({ modalOpen: false });
    })
    
    test('abrir y cerrar el modal', () => {
        
        const openModal = uiOpenModal();
        const closeModal = uiCloseModal();

        let state = uiReducer(initialState, openModal);
        // console.log( state )
        expect( state ).toEqual({ modalOpen: true });

        state = uiReducer(initialState, closeModal);

        expect( state ).toEqual({ modalOpen: false });

    })
    
})
