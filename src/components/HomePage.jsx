import React from 'react';
import PropTypes from 'prop-types';

const HomePage = props => (
  <div>
    <nav>
      <ul>
        {props.categories.map(category => (
          <li>
            <a href="/">{category}</a>
          </li>
        ))}
      </ul>
    </nav>
    {props.articles.map(article => (
      <div>
        <h3>{article.title}</h3>
        <p>{article.subtitle}</p>
        <p>{article.author}</p>
        <img src={article.articleImgURL} alt="article thumbnail" height="300" width="300" />
      </div>
    ))}
  </div>
);

HomePage.propTypes = {
  articles: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired
};

HomePage.defaultProps = {
  articles: [],
  categories: [
    'technology',
    'culture',
    'entrepreneurship',
    'creativity',
    'self',
    'politics',
    'media',
    'productivity',
    'design',
    'popular',
    'other'
  ]
};

export default HomePage;
