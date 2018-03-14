import React from 'react';
import PropTypes from 'prop-types';
import AuthorDetails from './AuthorDetails';

const LikedArticle = props => (
  <div
    style={{
      border: '1px solid black'
    }}
  >
    <AuthorDetails name={props.articleAuthor} />
    <img src={props.articleImg} height="250px" width="600px" />
    <h3>{props.articleTitle}</h3>
  </div>
);

LikedArticle.propTypes = {
  articleTitle: PropTypes.string.isRequired,
  articleAuthor: PropTypes.string.isRequired,
  articleImg: PropTypes.string.isRequired
};

export default LikedArticle;
