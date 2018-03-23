import React from 'react';
import PropTypes from 'prop-types';
import ArticleListItem from './ArticleListItem';

const ArticleList = props => (
  <div
    style={{
      marginBottom: '30px'
    }}
  >
    <h2>{props.type}</h2>
    {props.articles.length === 0
      ? `You have not ${props.type === 'Liked Articles' ? 'liked' : 'published'} any articles`
      : props.articles.map((article) => {
          console.log(article.author.username);
          return (
            <ArticleListItem
              articleTitle={article.title}
              articleAuthor={article.author.username}
              details={article.author.details}
              articleImg="https://static.pexels.com/photos/65834/pexels-photo-65834.jpeg"
              key={Math.floor(Math.random() * 99999)}
            />
          );
        })}
  </div>
);

ArticleList.propTypes = {
  articles: PropTypes.array,
  type: PropTypes.string.isRequired
};

ArticleList.defaultProps = {
  articles: []
};

export default ArticleList;
