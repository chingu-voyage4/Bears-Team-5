import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import AppRouter from './routes/AppRouter';
import './styles/styles.scss';

const store = configureStore();
const template = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

ReactDOM.render(template, document.getElementById('app'));
