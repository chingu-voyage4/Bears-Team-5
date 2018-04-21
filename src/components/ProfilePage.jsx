import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ArticleList from './ArticleList';

const ProfilePage = props => (
  <div>
    <h2>
      <strong>{props.match.params.username}</strong>
    </h2>
    <button>
      Publish New Article
    </button>
    <ArticleList type="Published Articles" articles={props.publishedArticles} username={props.match.params.username} />
  </div>
);

ProfilePage.propTypes = {
  publishedArticles: PropTypes.array,
};

const mapStateToProps = (state, props) => ({
  publishedArticles: state.articles.feed.filter(article => article.username === props.match.params.username)
});

export default connect(mapStateToProps)(ProfilePage);
