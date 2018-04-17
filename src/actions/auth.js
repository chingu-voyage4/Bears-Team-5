import axios from 'axios';

export const logIn = username => ({
  type: 'LOG_IN',
  username
});

export const setErrors = errors => ({
  type: 'SET_ERRORS',
  errors
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
        localStorage.setItem('token', response.data.token);
        dispatch(logIn(userCredentials.username));
      })
      .catch((error) => {
        const errorMsg = error.response.data.msg;
        dispatch(setErrors([errorMsg]));
      });
  };
};
