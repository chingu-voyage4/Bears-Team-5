
import React, { Component } from 'react';
import { connect } from 'react-redux';
import parser from 'html-react-parser';
import marked from 'marked';
import AuthorDetails from './AuthorDetails';
import Comments from './Comments';
import { startSetCurrentArticle, startLikeArticle, startUnlikeArticle } from '../actions/articles';

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
    (
      this.state.liked ? (
        this.props.unlikeArticle(article_id)
      ) : (
          this.props.likeArticle(article_id)
        ))
      .then(() => {
        this.setState((prevState) => ({
          liked: !prevState.liked
        }))
      });
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
          {this.props.suggestedArticles.map((article, index) => {
            return index < 3 ? (
              <li key={Math.floor(Math.random() * 99999)}>
                <a href="#">
                  <img src={article.image} />
                  <div>
                    <h3>{article.title}</h3>
                    <AuthorDetails name={article.username} />
                  </div>
                </a>
              </li>
            ) : (
                null
              )
          })}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  suggestedArticles: state.articles.feed.filter(article => (
    article.username !== localStorage.getItem("username")
  )),
  article: state.articles.feed.find(article => article.slug === props.match.params.slug),
  currentArticle: state.articles.currentArticle
});

const mapDispatchToProps = dispatch => ({
  setCurrentArticle: slug => dispatch(startSetCurrentArticle(slug)),
  likeArticle: article_id => dispatch(startLikeArticle(article_id)),
  unlikeArticle: article_id => dispatch(startUnlikeArticle(article_id))
});

export default connect(mapStateToProps, mapDispatchToProps)(ArticlePage);

