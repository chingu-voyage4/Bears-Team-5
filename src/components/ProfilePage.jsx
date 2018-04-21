import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ArticleList from './ArticleList';

class ProfilePage extends Component {
  onClick = e => {
    this.props.history.push("/articles/create");
  }

  render() {
    return (
      <div>
        <h2>
          <strong>{this.props.match.params.username}</strong>
        </h2>
        <button onClick={this.onClick}>
          Publish New Article
        </button>
        <ArticleList type="Published Articles" articles={this.props.publishedArticles} username={this.props.match.params.username} />
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
