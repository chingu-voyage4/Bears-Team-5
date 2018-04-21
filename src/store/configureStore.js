import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import messagesReducer from '../reducers/messages';
import articlesReducer from '../reducers/articles';
import errorsReducer from '../reducers/errors';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  const store = createStore(
    combineReducers({
      articles: articlesReducer,
      messages: authReducer,
      errors: errorsReducer
    }),
    composeEnhancers(applyMiddleware(thunk))
);
  return store;
};
