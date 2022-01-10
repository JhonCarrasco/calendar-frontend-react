import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store';

import '@testing-library/jest-dom';
import { AppRouter } from '../../router/AppRouter';



// jest.mock('../../../actions/events', () => ({
//     eventStartDelete: jest.fn()
// }));

const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );


// solo queremos que se dispare startChecking
// store.dispatch = jest.fn();




describe('<AppRouter />', () => {
    

    test('snapshot', () => {

        const initState = {
            auth: {
                checking: true
            }
        };
        const store = mockStore( initState );

        const wrapper = mount(
            <Provider store={ store }>
                <AppRouter />
            </Provider>
        );
        
        expect( wrapper ).toMatchSnapshot();
        expect( wrapper.find('h5').exists() ).toBe( true );

    })

    test('show public route', () => {
        
        const initState = {
            auth: {
                checking: false,
                uid: null
            }
        };
        const store = mockStore( initState );

        const wrapper = mount(
            <Provider store={ store }>
                <AppRouter />
            </Provider>
        );

        expect( wrapper ).toMatchSnapshot();
        expect( wrapper.find('.login-container').exists() ).toBe( true );

    })

    test('show private route', () => {
        
        const initState = {
            auth: {
                checking: false,
                uid: 'abc123'
            },
            calendar: {
                events: []
            },
            ui: {
                modalOpen: false
            }
        };
        const store = mockStore( initState );

        const wrapper = mount(
            <Provider store={ store }>
                <AppRouter />
            </Provider>
        );

        expect( wrapper ).toMatchSnapshot();
        expect( wrapper.find('.calendar-screen').exists() ).toBe( true );

    })
    
})
