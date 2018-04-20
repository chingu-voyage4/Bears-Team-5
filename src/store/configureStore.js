import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import authReducer from '../reducers/auth';
import articlesReducer from '../reducers/articles';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  const store = createStore(
    combineReducers({
      articles: articlesReducer,
      auth: authReducer
    }),
    composeEnhancers(applyMiddleware(thunk)));
  return store;
};
