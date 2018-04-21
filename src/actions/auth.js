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
        setMessage('Log In Successful');
        dispatch(logIn(userCredentials.username));
      })
      .catch((error) => {
        const errorMsg = error.response.data.msg;
        dispatch(setLoginErrors(errorMsg));
      });
  };
};
