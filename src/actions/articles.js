import axios from 'axios';

export const setError = error => ({
  type: 'SET_ERROR',
  error
});

export const createArticle = article => ({
  type: 'CREATE_ARTICLE',
  article
});

export const startCreateArticle = (article) => {
  return (dispatch) => {
    const url = `${process.env.DB_URL}${'api/articles'}`;
    const config = {
      url,
      method: 'post',
      data: JSON.stringify(article),
      headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    };
    return axios(config)
      .then(response => (
        dispatch(createArticle(article))
      )).catch((error) => {
        const errorMsg = 'An error occured while trying to publish your article. Please try again.';
        dispatch(setError(errorMsg));
      });
  };
};

export const setArticles = articles => ({
  type: 'SET_ARTICLES',
  articles
});

export const startSetArticles = (dispatch) => {
  return (dispatch, getState) => {
    const category = getState().articles.category;
    console.log(category);
    const params = (category ? `?category=${category}` : '');
    const url = `${process.env.DB_URL}${'api/feeds'}${params}`;
    console.log(url);
    const config = {
      url,
      method: 'get',
      headers: {
        Authorization: localStorage.getItem('token')
      }
    };
    return axios(config)
      .then((response) => {
        const articles = response.data.articles;
        dispatch(setArticles(articles));
      })
      .catch(error => (
        console.log(error)
      ));
  };
};

export const setCategory = category => ({
  type: 'SET_CATEGORY',
  category
});
