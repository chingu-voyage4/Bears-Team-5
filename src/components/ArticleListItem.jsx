import React from 'react';
import PropTypes from 'prop-types';
import AuthorDetails from './AuthorDetails';

const ArticleListItem = props => (
  <div >
    <h3>{props.articleTitle}</h3>
    <img src={props.articleImg} height="250px" width="600px" />
  </div>
);

ArticleListItem.propTypes = {
  articleTitle: PropTypes.string.isRequired,
  articleAuthor: PropTypes.string.isRequired,
  articleImg: PropTypes.string.isRequired
};

export default ArticleListItem;
