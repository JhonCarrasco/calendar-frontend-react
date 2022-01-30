import React, { useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Redirect
  } from 'react-router-dom';
  
import { useDispatch, useSelector } from 'react-redux';

import { LoginScreen } from '../components/auth/LoginScreen';
import { CalendarScreen } from '../components/calendar/CalendarScreen';
import { startChecking } from '../actions/auth';
import { PublicRoute } from './PublicRoute';
import { PrivateRoute } from './PrivateRoute';
import { connect } from 'react-redux';

const AppRouter = ({checking, uid, getChecking}) => {

    const dispatch = useDispatch();
    // const { checking, uid } = useSelector( state => state.auth);

    useEffect(() => {
        
        // dispatch( startChecking() );
        getChecking()

    }, [dispatch])

    if ( checking ) {
        return (<h5>Wait...</h5>);
    }

    return (
        <Router>
            <div>
                <Switch>

                    <PublicRoute 
                        exact 
                        path="/login" 
                        component={ LoginScreen }
                        isAuthenticated={ !!uid }
                    />

                    <PrivateRoute 
                        exact 
                        path="/" 
                        component={ CalendarScreen } 
                        isAuthenticated={ !!uid }
                    />

                    <Redirect to="/" />   
                </Switch>
            </div>
        </Router>
    )
}

const mapStateToProps = (state) => {
    const {auth: { checking, uid }} = state

    return {
        checking,
        uid
    }
}

const mapDispatchToProps = (dispatch, { navigation }) => ({
    getChecking: () =>
      dispatch(startChecking()),
  })

export default connect(mapStateToProps, mapDispatchToProps)(AppRouter)