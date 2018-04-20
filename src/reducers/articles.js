const articlesReducerDefaultState = {};

export default (state = articlesReducerDefaultState, action) => {
  switch (action.type) {
    case 'CREATE_ARTICLE':
      return { ...state, feed: [...state.feed, action.article] };
    case 'EDIT_ARTICLE':
      return state.feeds.map((article) => {
        if (article.id === action.id) {
          return {
            ...article,
            ...action.updates
          };
        } else {
          return article;
        }
      });
    case 'SET_ARTICLES':
      return { ...state, feed: action.articles };
    case 'SET_CATEGORY':
      return { ...state, category: action.category };
    default:
      return state;
  }
};
