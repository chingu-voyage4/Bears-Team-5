import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import UserAuthentication from './components/UserAuthentication';

const store = configureStore();
const template = (
  <Provider store={store}>
    <UserAuthentication />
  </Provider>
);

ReactDOM.render(template, document.getElementById('app'));
