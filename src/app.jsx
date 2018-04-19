import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import { startSetArticles } from './actions/articles';
import AppRouter from './routes/AppRouter';
import './styles/styles.scss';

const store = configureStore();
const template = (
  <Provider store={store}>
    <div>
      <AppRouter />
    </div>
  </Provider>
);
const renderApp = () => {
  store.dispatch(startSetArticles())
    .then(() => {
      ReactDOM.render(template, document.getElementById('app'));
    });
};

renderApp();
