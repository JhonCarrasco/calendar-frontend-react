//renderizar un componente se debe usar React
// necesario el store para ver información y disparar acciones, se debera montar
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store';

import '@testing-library/jest-dom';

import { CalendarScreen } from '../../../components/calendar/CalendarScreen';
import { messages } from '../../../helpers/calendar-messages-es';
import { types } from '../../../types/types';
import { eventSetActive } from '../../../actions/events'
import { act } from '@testing-library/react';




// mock, simula la función
jest.mock('../../../actions/events', () => ({
    eventSetActive: jest.fn(),
    eventStartLoading: jest.fn()
}));
// mock localStorage
Storage.prototype.setItem = jest.fn();

const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );

const initState = {
    auth: {
        checking: false,
        uid: 'abc123',
        name: 'Testing'
    },
    calendar: {
        events: [],
        activeEvent: null
    },
    ui: {
        modalOpen: false
    }
};
const store = mockStore( initState );

store.dispatch = jest.fn();

const wrapper = mount(
    <Provider store={ store }>
        <CalendarScreen />
    </Provider>
)


describe('<CalendarScreen />', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    })

    test('snapshot ', () => {
        expect( wrapper ).toMatchSnapshot();
    })

    test('calendar interactions', () => {
        
        // obtener componente
        const calendar = wrapper.find('Calendar');

        const calendarMessages = calendar.prop('messages');        
        expect( calendarMessages ).toEqual( messages );

        // disparar el doble click
        calendar.prop('onDoubleClickEvent')();
        expect( store.dispatch ).toHaveBeenCalledWith( { type: types.uiOpenModal } );

        //evento seleccionado
        // otra forma
        calendar.prop('onSelectEvent')({ thing: 'hello'});
        //pasar cualquier argumento
        expect( eventSetActive ).toHaveBeenCalledWith({ thing: 'hello'});

        // por qué Act?
        // por que esa instrucción, hace una modificación en el setState
        act(() => {
            // al cambiar el view y que se haya almacenado en el localStorage
            calendar.prop('onView')('week');
            expect( localStorage.setItem ).toHaveBeenCalledWith('lastView', 'week');
        })
        


    })
    
    
})
