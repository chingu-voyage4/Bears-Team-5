const articlesReducerDefaultState = {};

export default (state = articlesReducerDefaultState, action) => {
  switch (action.type) {
    case 'CREATE_ARTICLE':
      return { ...state, feed: [...state.feed, action.article] };
    case 'SET_ARTICLES':
      return { ...state, feed: action.articles };
    case 'SET_CATEGORY':
      return { ...state, category: action.category };
    default:
      return state;
  }
};
