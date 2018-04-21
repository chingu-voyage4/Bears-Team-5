import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class ProfilePage extends Component {
  onClick = e => {
    this.props.history.push("/articles/create");
  }

  render() {
    return (
      <div className="profile">
        <h2 className="profile__title">
          <strong>{this.props.match.params.username}</strong>
        </h2>
        <button onClick={this.onClick} className="button">
          Publish New Article
        </button>
        <div className="article-list">
          {this.props.publishedArticles.length === 0 ? (
            <p>No articles to display</p>
          ) : (
              this.props.publishedArticles.map(article => (
                <div key={Math.floor(Math.random() * 9999)} className="article-list__article">
                  <Link to={`/articles/view/${article.slug}`}>
                    <h3 className="article-list__article-title">{article.title}</h3>
                    <img src={article.image} alt="article thumbnail" className="article-list__article-image" />
                  </Link>
                </div>
              ))
            )}
        </div>
      </div>
    );
  }
}

ProfilePage.propTypes = {
  publishedArticles: PropTypes.array,
};

const mapStateToProps = (state, props) => ({
  publishedArticles: state.articles.feed.filter(article => article.username === props.match.params.username)
});

export default connect(mapStateToProps)(ProfilePage);
