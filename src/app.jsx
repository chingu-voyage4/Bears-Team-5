import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import PageHeader from './components/PageHeader';

const store = configureStore();
const template = (
  <Provider store={store}>
    <PageHeader />
  </Provider>
);

ReactDOM.render(template, document.getElementById('app'));
