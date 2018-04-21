import axios from 'axios';
import { setLoginErrors, clearError } from './errors';
import { setMessage } from './messages';

export const logIn = username => ({
  type: 'LOG_IN',
  username
});

export const startLogIn = (userCredentials) => {
  return (dispatch) => {
    const url = 'http://localhost:4000/api/login';
    const config = {
      url,
      method: 'post',
      data: JSON.stringify(userCredentials),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    return axios(config)
      .then((response) => {
        dispatch(clearError('loginError'));
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', userCredentials.username);
        return dispatch(setMessage('Log In Successful'));
      })
      .catch((error) => {
        const errorMsg = error.response.data.msg;
        dispatch(setLoginErrors(errorMsg));
      });
  };
};

export const startSignUp = (userCredentials) => {
  return (dispatch) => {
    const url = 'http://localhost:4000/api/register';
    const config = {
      url,
      method: 'post',
      data: JSON.stringify(userCredentials),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    return axios(config)
      .then((response) => {
        // dispatch(clearError('loginError'));
        return dispatch(setMessage('Sign up Successful'));
      })
      .catch((error) => {
        const errors = error.response.data.errors;
        console.log(errors);
        // dispatch(setLoginErrors(errorMsg));
      });
  };
};
