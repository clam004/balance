// This is used to determine if a user is authenticated and
// if they are allowed to visit the page they navigated to.

// If they are: they proceed to the page
// If not: they are redirected to the login page.

import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { isLoggedIn } from './helpers/auth'

const PrivateRoute = ({ component: Component, ...rest }) => {

  const isLoggedIn = isLoggedIn()

  return (
    <Route
      {...rest}
      render={props =>
        isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )
      }
    />
  );
}

export default PrivateRoute


/*
  //const isAuthJSON = fetch('/api/is_logged_in');// 
  isLoggedIn()
  .then(res => {
    isAuth = res.is_logged_in;
    console.log('isAuth', isAuth);

*/