import React from 'react';
import PropTypes from 'prop-types';
import LikedArticle from './LikedArticle';

const LikedArticles = props => (
  <div>
    {props.articles.length === 0
      ? 'You have not liked any articles'
      : props.articles.map((article) => {
          return (
            <LikedArticle
              articleTitle={article.title}
              articleAuthor={article.author}
              articleImg="https://static.pexels.com/photos/65834/pexels-photo-65834.jpeg"
              key={Math.floor(Math.random() * 99999)}
            />
          );
        })}
  </div>
);

LikedArticles.propTypes = {
  articles: PropTypes.array
};

LikedArticles.defaultProps = {
  articles: []
};

export default LikedArticles;
