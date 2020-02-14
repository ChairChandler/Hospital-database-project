import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export default function PrivateRoute ({accountTypeUser, accountTypeComponent, children, ...rest}) {
    return (
      <Route
        {...rest}
        render={(props) => accountTypeUser === accountTypeComponent
          ? children
          : <Redirect to='/login'/>}
      />
    )
  }