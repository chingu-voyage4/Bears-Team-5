export default (state = {}, action) => {
  switch (action.type) {
    case 'SET_MESSAGE':
      return { ...state, message: action.message };
    case 'SET_MESSAGE':
      return { ...state, message: '' };
    default:
      return state;
  }
};
