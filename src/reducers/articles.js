const articlesReducerDefaultState = [];

export default (state = articlesReducerDefaultState, action) => {
  switch (action.type) {
    case "ADD_ARTICLE":
      return [...state, action.article];
    default:
      return state;
  }
};