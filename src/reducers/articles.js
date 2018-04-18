const articlesReducerDefaultState = [];

export default (state = articlesReducerDefaultState, action) => {
  switch (action.type) {
    case 'CREATE_ARTICLE':
      return [...state, action.article];
    case 'SET_ARTICLES':
      return action.articles;
    default:
      return state;
  }
};
