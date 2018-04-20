const articlesReducerDefaultState = [];

export default (state = articlesReducerDefaultState, action) => {
  switch (action.type) {
    case "CREATE_ARTICLE":
      return [...state, action.article];
    default:
      return state;
  }
};