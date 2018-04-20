import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({
  component: Component,
  ...rest
}) => {
  const token = localStorage.getItem('token') || '';
  return (
    <Route
      {...rest}
      component={props =>
        token === '' ? (
          <Redirect to="/" />
        ) : (
            <Component {...props} />
          )
      }
    />
  )
}
export default PrivateRoute;