import React from 'react';
import PropTypes from 'prop-types';
import LikedArticle from './LikedArticle';

const LikedArticles = props => (
  <div>
    {props.articles.map((article) => {
      return <LikedArticle articleTitle={article.title} articleAuthor={article.author} />;
    })}
  </div>
);

LikedArticles.propTypes = {
  articles: PropTypes.array.isRequired
};

export default LikedArticles;
