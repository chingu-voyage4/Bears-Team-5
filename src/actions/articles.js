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
      .then((response) => {
        return dispatch(createArticle(article));
      }).catch((error) => {
        const errorMsg = 'An error occured while trying to publish your article. Please try again.';
        dispatch(setError(errorMsg));
      });
  };
};

export const setArticles = articles => ({
  type: 'SET_ARTICLES',
  articles
});

export const startSetArticles = (category) => {
  return (dispatch, getState) => {
    const params = (category ? `?category=${category}` : '');
    const url = `${process.env.DB_URL}${'api/feeds'}${params}`;
    const headers = (localStorage.getItem('token') ? {
        Authorization: localStorage.getItem('token')
      } : {});
    const config = {
      url,
      method: 'get',
      headers
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

export const setArticlesByFollowedAuthors = articles => ({
  type: 'SET_ARTICLES_BY_FOLLOWED_AUTHORS',
  articles
});

export const startSetArticlesByFollowedAuthors = () => {
  return (dispatch, getState) => {
    const params = `?followed=${true}`;
    const url = `${process.env.DB_URL}${'api/feeds'}${params}`;
    const headers = (localStorage.getItem('token') ? {
        Authorization: localStorage.getItem('token')
      } : {});
    console.log(url);
    const config = {
      url,
      method: 'get',
      headers
    };
    return axios(config)
      .then((response) => {
        const articles = response.data.articles;
        console.log(articles);
        return dispatch(setArticlesByFollowedAuthors(articles));
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
    const data = {
      article_id: parseInt(id),
      ...updates
    };
    console.log(data);
    const config = {
      url,
      method: 'patch',
      data: JSON.stringify(data),
      headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    };
    return axios(config)
      .then((response) => {
        return dispatch(editArticle(id, updates));
      }).catch((error) => {
        const errorMsg = 'An error occured while trying to publish your article. Please try again.';
        dispatch(setError(errorMsg));
      });
  };
};

export const setCurrentArticle = currentArticle => ({
  type: 'SET_CURRENT_ARTICLE',
  currentArticle
});

export const startSetCurrentArticle = (slug) => {
  return (dispatch) => {
    const url = `${process.env.DB_URL}${'api/articles/'}${slug}`;
    const config = {
      url,
      method: 'get',
      headers: {
        Authorization: localStorage.getItem('token'),
      }
    };
    return axios(config)
      .then((response) => {
        return dispatch(setCurrentArticle(response.data.article));
      }).catch((error) => {
        const errorMsg = 'An error occured while trying to publish your article. Please try again.';
        dispatch(setError(errorMsg));
      });
  };
};

export const likeArticle = () => ({
  type: 'LIKE_ARTICLE'
});

export const startLikeArticle = (article_id) => {
  return (dispatch) => {
    const url = `${process.env.DB_URL}${'api/likes/'}`;
    const config = {
      url,
      method: 'post',
      data: JSON.stringify({ article_id }),
      headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/json'

      }
    };
    return axios(config)
      .then((response) => {
        return dispatch(likeArticle());
      }).catch((error) => {
        console.log('An error occured while trying to like this article. Please try again.');
        console.log(error.response);
      });
  };
};

export const unlikeArticle = () => ({
  type: 'UNLIKE_CURRENT_ARTICLE'
});

export const startUnlikeArticle = (article_id) => {
  return (dispatch) => {
    const url = `${process.env.DB_URL}${'api/likes/'}`;
    const config = {
      url,
      method: 'delete',
      data: JSON.stringify({ article_id }),
      headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/json'

      }
    };
    return axios(config)
      .then((response) => {
        return dispatch(unlikeArticle());
      }).catch((error) => {
        console.log('An error occured while trying to unlike this article. Please try again.');
        console.log(error.response);
      });
  };
};
