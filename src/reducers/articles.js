const articlesReducerDefaultState = [];

export default (state = articlesReducerDefaultState, action) => {
  switch (action.type) {
    case "CREATE_ARTICLE":
      return [...state, action.article];
    case 'SET_ERROR':
      return { ...state, error: action.error };
    default:
      return state;
  }
};