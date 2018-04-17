import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import slugify from 'slugify';
import AuthorDetails from './AuthorDetails';
import { startCreateArticle } from '../actions/articles';

class CreateArticle extends Component {
  state = {
    articleBody: '',
    articleTitle: '',
    articleCategory: 'technology',
    imgUrl: '',
    errors: {
      titleIsBlank: false,
      bodyIsBlank: false,
    }
  };

  onTitleChange = e => {
    const value = e.target.value;
    this.setState((prevState) => {
      const errors = prevState.errors;
      errors.titleIsBlank = false;
      return {
        articleTitle: value,
        errors
      }
    });
  };

  onBodyChange = e => {
    const value = e.target.value;
    this.setState((prevState) => {
      const errors = prevState.errors;
      errors.bodyIsBlank = false;
      return {
        articleBody: value,
        errors
      }
    });
  };

  onCategoryChange = e => {
    const value = e.target.value;
    this.setState(() => ({
      articleCategory: value,
    }));
  };

  onURLChange = e => {
    const value = e.target.value;
    this.setState(() => ({
      imgUrl: value,
    }));
  };

  onSubmit = e => {
    e.preventDefault();
    const body = this.state.articleBody;
    const title = this.state.articleTitle;
    const category = this.state.articleCategory;
    const date = moment().format("YYYY-MM-DD");
    if (!(body === "" || title === "")) {
      const article = {
        body,
        title,
        category,
        date,
      }
      this.props.createArticle(article);
      this.setState(() => ({
        errors: {
          bodyIsBlank: false,
          titleIsBlank: false
        }
      }))
    } else {
      this.setState(() => ({
        errors: {
          bodyIsBlank: body === "",
          titleIsBlank: title === ""
        }
      }))
    }
  }

  render() {
    return (
      <div>
        <AuthorDetails
          name="Anonymous"
          imgUrl="https://images.pexels.com/photos/38275/anonymous-studio-figure-photography-facial-mask-38275.jpeg?w=940&h=650&auto=compress&cs=tinysrgb"
        />
        <form onSubmit={this.onSubmit}>
          {this.state.errors.titleIsBlank && <p>Title cannot be left blank</p>}
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
          {this.state.errors.bodyIsBlank && <p>Body cannot be left blank</p>}
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
          <input
            type="text"
            name="imageURL"
            onChange={this.onURLChange}
            placeholder="Image URL (Optional)"
            style={{
              border: 'none',
              display: 'block',
              fontSize: '30px',
              height: '50px',
              margin: '15px auto',
              padding: '0 10px',
              width: '60%',
            }}
            value={this.state.imgUrl}
          />
          {this.props.publishingError && <p>{this.props.publishingError}</p>}
          <button type="submit">Publish Article</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  publishingError: state.articles.error
});

const mapDispatchToProps = dispatch => ({
  createArticle: article => dispatch(startCreateArticle(article))
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateArticle);
