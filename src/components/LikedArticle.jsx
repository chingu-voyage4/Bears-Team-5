import React from 'react';
import PropTypes from 'prop-types';

const LikedArticle = props => (
  <div>
    <h3>{props.articleTitle}</h3>
    <p>{props.articleAuthor}</p>
  </div>
);

LikedArticle.propTypes = {
  articleTitle: PropTypes.string.isRequired,
  articleAuthor: PropTypes.string.isRequired
};

export default LikedArticle;
