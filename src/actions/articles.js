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

export const startSetArticles = () => {
  return (dispatch, getState) => {
    const category = getState().articles.category;
    const params = (category ? `?category=${category}` : '');
    const url = `${process.env.DB_URL}${'api/feeds'}${params}`;
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

export const editArticle = (id, updates) => ({
  type: 'EDIT_ARTICLE',
  id,
  updates
});

export const startEditArticle = (id, updates) => {
  return (dispatch) => {
    const url = `${process.env.DB_URL}${'api/articles'}`;
    const data = { article_id: parseInt(id), ...updates };
    console.log(data);
    const config = {
      url,
      method: 'patch',
      updates: JSON.stringify(data),
      headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    };
    return axios(config)
      .then((response) => {
        console.log(response);
        dispatch(editArticle(id, updates));
      }).catch((error) => {
        console.log(error.response.data.errors);
        const errorMsg = 'An error occured while trying to publish your article. Please try again.';
        dispatch(setError(errorMsg));
      });
  };
};
