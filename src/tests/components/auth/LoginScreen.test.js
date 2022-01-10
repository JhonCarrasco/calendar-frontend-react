//renderizar un componente se debe usar React
// necesario el store para ver información y disparar acciones, se debera montar
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store';

import '@testing-library/jest-dom';
import { LoginScreen } from '../../../components/auth/LoginScreen';
import { startLogin, startRegister } from '../../../actions/auth';
import Swal from 'sweetalert2';


// mock, simula la función
jest.mock('../../../actions/auth', () => ({
    startLogin: jest.fn(),
    startRegister: jest.fn()
}));
jest.mock('sweetalert2', () => ({
    fire: jest.fn()
}));

const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );

const initState = {};
const store = mockStore( initState );

store.dispatch = jest.fn();

const wrapper = mount(
    <Provider store={ store }>
        <LoginScreen />
    </Provider>
)


describe('<LoginScreen />', () => {
    
    //usar siempre que se trabaje con mocks
    beforeEach(() => {
        jest.clearAllMocks();
    })
    
    test('snapshot', () => {
        
        expect( wrapper ).toMatchSnapshot();
    })

    test('startLogin', async () => {
        
        // ingresar credenciales
        wrapper.find('input[name="lEmail"]').simulate('change', {
            target: {
                name: 'lEmail',
                value: 'test@test.com'
            }
        });

        wrapper.find('input[name="lPassword"]').simulate('change', {
            target: {
                name: 'lPassword',
                value: '123456'
            }
        });

        // ejecutar form
        wrapper.find('form').at(0).prop('onSubmit')({
            preventDefault(){}
        });

        // confirmar el llamado del dispatch
        expect( startLogin ).toHaveBeenLastCalledWith('test@test.com', '123456');
        
    })

    test('different passwords', () => {
        wrapper.find('input[name="rPassword"]').simulate('change', {
            target: {
                name: 'rPassword',
                value: '123456'
            }
        });

        wrapper.find('input[name="rPassword2"]').simulate('change', {
            target: {
                name: 'rPassword2',
                value: '123456789'
            }
        });

        // ejecutar form
        wrapper.find('form').at(1).prop('onSubmit')({
            preventDefault(){}
        });

        // confirmar el llamado del dispatch
        expect( Swal.fire ).toHaveBeenLastCalledWith('Error', 'Passwords must be the same', 'error');
        expect( startRegister ).not.toHaveBeenCalled();
    })
    

    test('startRegister', async () => {

                
        // ingresar credenciales
        wrapper.find('input[name="rName"]').simulate('change', {
            target: {
                name: 'rName',
                value: 'Testing2'
            }
        });

        wrapper.find('input[name="rEmail"]').simulate('change', {
            target: {
                name: 'rEmail',
                value: 'test2@test.com'
            }
        });

        wrapper.find('input[name="rPassword"]').simulate('change', {
            target: {
                name: 'rPassword',
                value: '123456'
            }
        });

        wrapper.find('input[name="rPassword2"]').simulate('change', {
            target: {
                name: 'rPassword2',
                value: '123456'
            }
        });

        // ejecutar form
        wrapper.find('form').at(1).prop('onSubmit')({
            preventDefault(){}
        });

        // confirmar el llamado del dispatch
        expect( startRegister ).toHaveBeenLastCalledWith('Testing2', 'test2@test.com', '123456');
        expect( Swal.fire ).not.toHaveBeenCalled();
    })
    
    
})
