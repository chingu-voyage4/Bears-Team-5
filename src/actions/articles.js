import axios from 'axios';

export const createArticle = article => ({
  type: 'CREATE_ARTICLE',
  article
});

export const startCreateArticle = article => {
  return (dispatch) => {
    const url = process.env.DB_URL + "api/articles";
    const config = {
      url,
      method: 'post',
      data: JSON.stringify(article),
      headers: {
        'Authorization': localStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    };
    return axios(config)
      .then(response => {
        dispatch(createArticle(article));
        console.log(response.data);
      }).catch()
  }
}
