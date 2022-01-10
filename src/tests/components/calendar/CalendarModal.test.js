//renderizar un componente se debe usar React
// necesario el store para ver información y disparar acciones, se debera montar
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom';
import moment from 'moment';


import { CalendarModal } from '../../../components/calendar/CalendarModal';
import { eventClearActiveEvent, eventStartAddNew, eventStartUpdate } from '../../../actions/events';

import Swal from 'sweetalert2';
import { act } from '@testing-library/react';

// mock, simula la función
jest.mock('../../../actions/events', () => ({
    eventStartUpdate: jest.fn(),
    eventStartAddNew: jest.fn(),
    eventClearActiveEvent: jest.fn()
}));
jest.mock('../../../actions/ui', () => ({
    uiCloseModal: jest.fn()
}));
jest.mock('sweetalert2', () => ({
    fire: jest.fn()
}));

const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );

const now = moment().minutes(0).seconds(0).add(1,'hours'); // 3:00:00
const nowPlus1 = now.clone().add(1, 'hours');

const initState = {
    auth: {
        checking: false,
        uid: 'abc123',
        name: 'Testing'
    },
    calendar: {
        events: [],
        activeEvent: {
            title:'Evento',
            notes:'DevOps',
            start: now.toDate(),
            end: nowPlus1.toDate()
        }
    },
    ui: {
        modalOpen: true
    }
};
const store = mockStore( initState );

store.dispatch = jest.fn();

const wrapper = mount(
    <Provider store={ store }>
        <CalendarModal />
    </Provider>
)

describe('<CalendarModal />', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    })

    test('show modal', () => {
        expect( wrapper.find('Modal').prop('isOpen') ).toBe( true );
    })

    test('update and close modal actions', () => {
        
        // llamar submit
        wrapper.find('form').simulate('submit', {
            preventDefault(){}
        });

        // actualizar event y cerrar modal
        expect( eventStartUpdate ).toHaveBeenCalledWith( initState.calendar.activeEvent);
        expect( eventClearActiveEvent ).toHaveBeenCalled();
    })

    test('title required, display error', () => {
        
        wrapper.find('form').simulate('submit', {
            preventDefault(){}
        });
        // en la prueba anterior los campos han sido limpiados con el fn closeModal()
        expect( wrapper.find('input[name="title"]').hasClass('is-invalid') ).toBe( true );
        
    })

    test('create new event', () => {
        
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
                modalOpen: true
            }
        };
        const store = mockStore( initState );
        store.dispatch = jest.fn();
        const wrapper = mount(
            <Provider store={ store }>
                <CalendarModal />
            </Provider>
        );

        // input title
        wrapper.find('input[name="title"]').simulate('change', {
            target: {
                name: 'title',
                value: 'new event'
            }
        });

        wrapper.find('form').simulate('submit', {
            preventDefault(){}
        });

        expect( eventStartAddNew ).toHaveBeenCalledWith({
            end: expect.anything(),
            notes: expect.any(String),
            start: expect.anything(),
            title: 'new event'
        });
        expect( eventClearActiveEvent ).toHaveBeenCalled();
        
    })

    test('dates is not valid', () => {
        
        const today = new Date();
        
        act(() => {
            wrapper.find('DateTimePicker').at(1).prop('onChange')(today);
        });
        

        wrapper.find('form').simulate('submit', {
            preventDefault(){}
        });

        expect( Swal.fire )
        .toHaveBeenCalledWith('Error', 'La fecha fin debe de ser mayor a la fecha de inicio', 'error');
    })
    
    
    
})
