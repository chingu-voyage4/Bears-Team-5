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
    <Link to="/articles/create" >Publish New Article</Link>
    <ArticleList type="Published Articles" articles={props.publishedArticles} username={props.match.params.username} />
    <div>
      Icons made by{' '}
      <a href="http://www.freepik.com" title="Freepik">
        Freepik
      </a>{' '}
      from{' '}
      <a href="https://www.flaticon.com/" title="Flaticon">
        www.flaticon.com
      </a>{' '}
      is licensed by{' '}
      <a
        href="http://creativecommons.org/licenses/by/3.0/"
        title="Creative Commons BY 3.0"
        target="_blank"
      >
        CC 3.0 BY
      </a>
    </div>
  </div>
);

ProfilePage.propTypes = {
  publishedArticles: PropTypes.array,
};

const mapStateToProps = (state, props) => ({
  publishedArticles: state.articles.feed.filter(article => article.username === props.match.params.username)
});

export default connect(mapStateToProps)(ProfilePage);
