import React, { Component, Fragment } from 'react';
import AuthorDetails from './AuthorDetails';

class CreateArticle extends Component {
  state = {
    articleBody: '',
    articleTitle: '',
    articleCategory: 'technology'
  };

  onTitleChange = e => {
    const value = e.target.value;
    this.setState({
      articleTitle: value,
    });
  };

  onBodyChange = e => {
    const value = e.target.value;
    this.setState({
      articleBody: value,
    });
  };

  onCategoryChange = e => {
    const value = e.target.value;
    this.setState({
      articleCategory: value,
    });
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
            onChange={this.onTitleChange}
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
            value={this.state.articleTitle}
          />
          <br />
          <select onChange={this.onCategoryChange}>
            <option value="technology" >technology</option>
            <option value="culture" >culture</option>
            <option value="entrepreneurship" >entrepreneurship</option>
            <option value="creativity" >creativity</option>
            <option value="self" >self</option>
            <option value="politics" >politics</option>
            <option value="media" >media</option>
            <option value="productivity" >productivity</option>
            <option value="design" >design</option>
            <option value="popular" >popular</option>
            <option value="other" >other</option>
          </select>
          <br />
          <textarea
            name="body"
            onChange={this.onBodyChange}
            placeholder="Tell us your story ..."
            style={{
              border: 'none',
              display: 'block',
              fontSize: '30px',
              height: '50px',
              margin: '0 auto 30px auto',
              padding: '0 10px',
              width: '60%',
            }}
            value={this.state.articleBody}
          />
        </form>
      </div>
    );
  }
}

export default CreateArticle;
