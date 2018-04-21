import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import slugify from 'slugify';
import Textarea from "react-textarea-autosize";
import AuthorDetails from './AuthorDetails';
import { startCreateArticle } from '../actions/articles';

class CreateArticle extends Component {
  state = {
    articleBody: '',
    articleTitle: '',
    articleCategory: 'other',
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
    const image = this.state.imgUrl;
    const date = moment().format("YYYY-MM-DD");
    if (!(body === "" || title === "" || imageUrl === "")) {
      const article = {
        body,
        title,
        category,
        date,
        image
      }
      this.props.createArticle(article)
        .then(() => {
          this.setState(() => ({
            errors: {
              bodyIsBlank: false,
              titleIsBlank: false,
              imageIsBlank: false,
            }
          }));
          this.props.history.push("/");
        });

    } else {
      this.setState(() => ({
        errors: {
          bodyIsBlank: body === "",
          titleIsBlank: title === "",
          imageIsBlank: imageUrl === "",
        }
      }))
    }
  }

  render() {
    return (
      <div className="container article-form">
        <form onSubmit={this.onSubmit}>
          {this.state.errors.titleIsBlank && <p>Title cannot be left blank</p>}
          <input
            type="text"
            name="title"
            onChange={this.onTitleChange}
            placeholder="Article Title"
            value={this.state.articleTitle}
            className="article-form__title"
          />
          <select onChange={this.onCategoryChange} className="article-form__select">
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
          {this.state.errors.bodyIsBlank && <p>Body cannot be left blank</p>}
          <Textarea
            name="body"
            onChange={this.onBodyChange}
            placeholder="Tell us your story ..."
            className="article-form__body"
            value={this.state.articleBody}
          />
          {this.state.errors.imageIsBlank && <p>Article cannot be created without a cover image</p>}
          <input
            type="text"
            name="imageURL"
            onChange={this.onURLChange}
            placeholder="Image URL (Optional)"
            value={this.state.imgUrl}
            className="article-form__image"
          />
          {this.props.publishingError && <p>{this.props.publishingError}</p>}
          <button type="submit" className="button">Publish Article</button>
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
