import { authReducer } from "../../reducers/authReducer";
import { types } from "../../types/types";

const initialState = {
    checking: true,
    // uid: null,
    // name: null
};

describe('authReducer', () => {
    
    test('default initialState', () => {
        
        const action = {};

        const state = authReducer(initialState, action);

        expect( state ).toEqual( initialState );
    })
    
    test('authLogin', () => {
        
        const action = {
            type: types.authLogin,
            payload: {
                uid: 'abc123',
                name: 'testingUser'
            }
        };

        const state = authReducer(initialState, action);
        // console.log(state)
        expect( state ).toEqual( { 
            checking: false, 
            uid: 'abc123', 
            name: 'testingUser' 
        } );
    })

    test('authCheckingFinish ', () => {
        
        const action = { type: types.authCheckingFinish }

        const state = authReducer(initialState, action);

        expect( state ).toEqual( { checking: false } );

    })
    
    test('authLogout', () => {
        
        const action = {
            type: types.authLogout
        };

        const state = authReducer(initialState, action);
        // console.log(state)
        expect( state ).toEqual( { checking: false } );
    });
    
    
})
