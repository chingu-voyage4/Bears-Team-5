import axios from 'axios';

export const logIn = username => ({
  type: 'LOG_IN',
  username
});

export const startLogIn = (userCredentials) => {
  return (dispatch) => {
    const url = 'localhost:4000/api/login';
    const config = {
      url,
      method: 'post',
      data: JSON.stringify(userCredentials),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    return axios(config).then((response) => {
      dispatch(logIn(userCredentials.username));
    });
  };
};
