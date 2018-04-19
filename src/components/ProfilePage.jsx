import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ArticleList from './ArticleList';

const ProfilePage = props => (
  <div>
    <h2>
      <strong>{props.username}</strong>
    </h2>
    <p>{props.numFollowing} following</p>
    <p>{props.numFollowers} followers</p>
    <img src={props.userImgURL} height="30px" width="30px" />
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
  userImgURL: PropTypes.string
};

ProfilePage.defaultProps = {
  userImgURL: 'https://i.imgur.com/mECBxga.png',
};

const mapStateToProps = (state, props) => ({
  publishedArticles: state.articles.feed.filter(article => article.username === props.match.params.username)
});

export default connect(mapStateToProps)(ProfilePage);
