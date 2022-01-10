import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Swal from 'sweetalert2';

import { startLogin, startRegister, startChecking } from '../../actions/auth';
import { types } from '../../types/types';
import * as fetchModule from '../../helpers/fetch';

import '@testing-library/jest-dom';


jest.mock('sweetalert2', ()=> ({
    fire: jest.fn()
}))


const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );

const initState = {};
let store = mockStore( initState );

Storage.prototype.setItem = jest.fn();

let token ='';

describe('Auth', () => {

    beforeEach(()=> {
        store = mockStore( initState );
        jest.clearAllMocks();
    });


    test('startLogin success', async() => {

        await store.dispatch( startLogin('test@test.com','123456') );

        const actions = store.getActions();
        
        expect( actions[0] ).toEqual({
            type: types.authLogin,
            payload: {
                uid: expect.any(String),
                name: expect.any(String)
            }
        })

        expect( localStorage.setItem ).toHaveBeenCalledWith('token', expect.any(String));
        expect( localStorage.setItem ).toHaveBeenCalledWith('token-init-date', expect.any(Number) );

        token = localStorage.setItem.mock.calls[0][1];
        // console.log(localStorage.setItem.mock.calls[0][1])
        
    });


    test('startLogin fail', async() => {

        await store.dispatch( startLogin('test@test.com','123456789') );
        let actions = store.getActions();

        expect( actions ).toEqual([]);
        expect( Swal.fire ).toHaveBeenCalledWith('Error', 'Password incorrect', 'error');

        await store.dispatch( startLogin('test@test2222.com','123456') );
        actions = store.getActions();

        expect( Swal.fire ).toHaveBeenCalledWith('Error', 'User not exists with that email', 'error');
        
    });


    test('startRegister success', async() => {

        fetchModule.fetchNoToken = jest.fn(() => ({
            json() {
                return {
                    ok: true,
                    uid: '123',
                    name: 'carlos',
                    token: 'ABC123ABC123'
                }
            }
        }));

        await store.dispatch( startRegister('Testing2', 'test2@test.com', '123456' ) );

        const actions = store.getActions();

        expect( actions[0] ).toEqual({
            type: types.authLogin,
            payload: {
                uid: '123',
                name: 'carlos'
            }
        })

        expect( localStorage.setItem ).toHaveBeenCalledWith('token', 'ABC123ABC123' );
        expect( localStorage.setItem ).toHaveBeenCalledWith('token-init-date', expect.any(Number) );


        
    })
    
    
    test('startChecking success', async() => {

        fetchModule.fetchWithToken = jest.fn(() => ({
            json() {
                return {
                    ok: true,
                    uid: '123',
                    name: 'carlos',
                    token: 'ABC123ABC123'
                }
            }
        }));


        await store.dispatch( startChecking() );

        const actions = store.getActions();
        
        expect( actions[0] ).toEqual({
            type: types.authLogin,
            payload: {
                uid: '123',
                name: 'carlos'
            }
        });


        expect( localStorage.setItem ).toHaveBeenCalledWith('token', 'ABC123ABC123' );

        
    })
    
    

    
})
