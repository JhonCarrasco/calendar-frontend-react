//renderizar un componente se debe usar React
// necesario el store para ver información y disparar acciones, se debera montar
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store';

import '@testing-library/jest-dom';
import { DeleteEventFab } from '../../../components/ui/DeleteEventFab';
import { eventStartDelete } from '../../../actions/events';

// mock, simula la función
jest.mock('../../../actions/events', () => ({
    eventStartDelete: jest.fn()
}));

const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );

const initState = {};
const store = mockStore( initState );
// solo queremos que se dispare eventStartDelete
store.dispatch = jest.fn();

const wrapper = mount(
    <Provider store={ store }>
        <DeleteEventFab />
    </Provider>
)


describe('<DeleteEventFab />', () => {
    

    test('snapshot', () => {
        
        expect( wrapper ).toMatchSnapshot();
    })

    test('call eventStartDelete', async () => {
        

        wrapper.find('button').prop('onClick')();
                
        expect( eventStartDelete ).toHaveBeenCalled();
    })
    
    
})
