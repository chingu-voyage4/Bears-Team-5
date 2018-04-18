const articlesReducerDefaultState = {};

export default (state = articlesReducerDefaultState, action) => {
  switch (action.type) {
    case 'CREATE_ARTICLE':
      return { ...state, feed: [...state.feed, action.article] };
    case 'SET_ARTICLES':
      return { feed: action.articles };
    default:
      return state;
  }
};
