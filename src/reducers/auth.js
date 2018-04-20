export default (state = {}, action) => {
  switch (action.type) {
    case 'LOG_IN':
      return { ...state, username: action.username, errors: '' };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    default:
      return state;
  }
};
