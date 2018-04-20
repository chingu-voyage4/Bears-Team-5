import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import slugify from 'slugify';
import AuthorDetails from './AuthorDetails';
import { startEditArticle } from '../actions/articles';

class EditArticle extends Component {
  state = {
    articleBody: this.props.article.body,
    articleTitle: this.props.article.title,
    articleCategory: this.props.article.category,
    imgUrl: this.props.article.image,
    errors: {
      titleIsBlank: false,
      bodyIsBlank: false,
    },
    isUpdated: {
      body: false,
      title: false,
      category: false,
      image: false,
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
    const newbody = this.state.articleBody;
    const newtitle = this.state.articleTitle;
    const newcategory = this.state.articleCategory;
    const newimage = this.state.imgUrl;
    if (!(newbody === "" || newtitle === "")) {
      const updates = {
        newbody,
        newtitle,
        newcategory,
        newimage
      }
      this.props.editArticle(this.props.article.article_id, updates);
      this.setState(() => ({
        errors: {
          bodyIsBlank: false,
          titleIsBlank: false
        }
      }));
    } else {
      this.setState(() => ({
        errors: {
          bodyIsBlank: newbody === "",
          titleIsBlank: newtitle === ""
        }
      }))
    }
  }

  render() {
    return (
      <div>
        <AuthorDetails
          name={localStorage.getItem('username')}
          imgUrl={this.props.article.avatar}
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
          <button type="submit">Edit Article</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  publishingError: state.articles.error,
  article: state.articles.feed.find(article => article.article_id === parseInt(props.match.params.id))
});

const mapDispatchToProps = (dispatch) => ({
  editArticle: (id, updates) => dispatch(startEditArticle(id, updates))
});

export default connect(mapStateToProps, mapDispatchToProps)(EditArticle);
