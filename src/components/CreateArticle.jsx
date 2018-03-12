import React, { Component, Fragment } from 'react';
import AuthorDetails from './AuthorDetails';

class CreateArticle extends Component {
  state = {
    articleBody: '',
    articleTitle: '',
  };

  render() {
    return (
      <div>
        <AuthorDetails
          name="Anonymous"
          imgUrl="https://images.pexels.com/photos/38275/anonymous-studio-figure-photography-facial-mask-38275.jpeg?w=940&h=650&auto=compress&cs=tinysrgb"
        />
        <form>
          <input
            type="text"
            name="title"
            placeholder="Title"
            style={{
              border: 'none',
              display: 'block',
              fontSize: '30px',
              fontWeight: 'bold',
              height: '50px',
              margin: '15px auto',
              padding: '0 10px',
              width: '60%',
            }}
          />
          <br />
          <textarea
            name="body"
            style={{
              border: 'none',
              display: 'block',
              fontSize: '30px',
              height: '50px;',
              margin: '0 auto 30px auto',
              padding: '0 10px',
              width: '60%',
            }}
          />
        </form>
      </div>
    );
  }
}

export default CreateArticle;
