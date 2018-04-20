import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ArticleListItem from './ArticleListItem';

const ArticleList = props => (
  <div
  >
    <h2>{props.type}</h2>
    {props.articles.length === 0
      ? `You have not ${props.type === 'Liked Articles' ? 'liked' : 'published'} any articles`
      : props.articles.map((article) => {
        return (
          <Link to={`/articles/edit/${article.article_id}`}>
            <ArticleListItem
              articleTitle={article.title}
              articleAuthor={props.username}
              articleImg={article.image}
              key={Math.floor(Math.random() * 99999)}
            />
          </Link>
        );
      })}
  </div >
);

ArticleList.propTypes = {
  articles: PropTypes.array,
  type: PropTypes.string.isRequired
};

ArticleList.defaultProps = {
  articles: []
};

export default ArticleList;
