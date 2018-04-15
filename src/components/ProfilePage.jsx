import React from 'react';
import PropTypes from 'prop-types';
import ArticleList from './ArticleList';

const ProfilePage = props => (
  <div>
    <h2>
      <strong>{props.username}</strong>
    </h2>
    <p>{props.numFollowing} following</p>
    <p>{props.numFollowers} followers</p>
    <img src={props.userImgURL} height="30px" width="30px" />
    <ArticleList type="Liked Articles" articles={props.likedArticles} />
    <ArticleList type="Published Articles" articles={props.publishedArticles} />
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
  username: PropTypes.string.isRequired,
  numFollowing: PropTypes.number.isRequired,
  numFollowers: PropTypes.number.isRequired,
  likedArticles: PropTypes.array,
  publishedArticles: PropTypes.array,
  userImgURL: PropTypes.string
};

ProfilePage.defaultProps = {
  userImgURL: 'https://i.imgur.com/mECBxga.png',
  likedArticles: [],
  publishedArticles: []
};

export default ProfilePage;