import React, { Component } from 'react';
import { connect } from 'react-redux';
import parser from 'html-react-parser';
import marked from 'marked';
import AuthorDetails from './AuthorDetails';
import Comments from './Comments';
import { startSetCurrentArticle, startLikeArticle } from '../actions/articles';

class ArticlePage extends Component {
  state = {
    liked: false,
    currentUser: localStorage.getItem('username')
  }

  componentDidMount() {
    this.props.setCurrentArticle(this.props.match.params.slug).then(() => {
      if (this.props.currentArticle.liked) {
        this.setState(() => ({ liked: true }))
      }
    });
  }

  onClick = (e) => {
    const article_id = this.props.article.article_id;
    this.props.likeArticle(article_id).then(() => (
      this.props.setCurrentArticle(this.props.match.params.slug)
    ));
  }

  render() {
    return (
      <div className="article container">
        <AuthorDetails
          imgUrl={this.props.article.avatar}
          name={this.props.article.username}
        />
        <h2 className="article__title">{this.props.article.title}</h2>
        {
          parser(marked(this.props.article.body))
        }
        <div>
          {this.props.article.username !== this.state.currentUser && <button onClick={this.onClick}>{this.state.liked ? 'unlike' : 'like'}</button>}
        </div>
        <h3>Suggested Articles</h3>
        <ul className="article__suggestions">
          <li>
            <a href="#">
              <img src="https://i.imgur.com/FMA5Y3v.jpg" />
              <div>
                <h3>Suggested Article</h3>
                <AuthorDetails name="Name Goes Here" />
              </div>
            </a>
          </li>
          <li>
            <a href="#">
              <img src="https://i.imgur.com/FMA5Y3v.jpg" />
              <div>
                <h3>Suggested Article</h3>
                <AuthorDetails name="Name Goes Here" />
              </div>
            </a>
          </li>
          <li>
            <a href="#">
              <img src="https://i.imgur.com/FMA5Y3v.jpg" />
              <div>
                <h3>Suggested Article</h3>
                <AuthorDetails name="Name Goes Here" />
              </div>
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  article: state.articles.feed.find(article => article.slug === props.match.params.slug),
  currentArticle: state.articles.currentArticle
});

const mapDispatchToProps = dispatch => ({
  setCurrentArticle: slug => dispatch(startSetCurrentArticle(slug)),
  likeArticle: article_id => dispatch(startLikeArticle(article_id))
});

export default connect(mapStateToProps, mapDispatchToProps)(ArticlePage);
