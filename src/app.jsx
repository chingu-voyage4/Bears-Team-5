import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
// import AppRouter from './routes/AppRouter';
import CreateArticle from './components/CreateArticle'
import PageHeader from './components/PageHeader'
import './styles/styles.scss';

const store = configureStore();
const template = (
  <Provider store={store}>
    <div>
      <PageHeader />
      <CreateArticle />
    </div>
  </Provider>
);

ReactDOM.render(template, document.getElementById('app'));
