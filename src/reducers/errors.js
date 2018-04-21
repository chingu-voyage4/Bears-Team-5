export default (state = {}, action) => {
  switch (action.type) {
    case 'SET_ARTICLE_PUBLISHING_ERROR':
      return { ...state, publishingError: action.publishingError };
    case 'SET_LOGIN_ERROR':
      return { ...state, loginError: action.loginError };
    case 'SET_SIGN_UP_ERRORS':
      return { ...state, signUpErrors: action.signUpErrors };
    case 'CLEAR_ERROR':
      switch (action.errorType) {
        case 'loginError':
          return { ...state, loginError: '' };
        case 'publishingError':
          return { ...state, publishingError: '' };
        case 'signUpError':
          return { ...state, signUpErrors: [] };
        default:
          return state;
      }
    default:
      return state;
  }
};
