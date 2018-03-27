export default (state = {}, action) => {
  switch (action.type) {
    case 'LOG_IN':
      return {
        ...state,
        ...action.username
      };
    default:
      return state;
  }
};
