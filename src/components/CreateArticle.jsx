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
          <input type="text" name="title" placeholder="Title" />
          <br />
          <textarea name="body" />
        </form>
      </div>
    );
  }
}

export default CreateArticle;
