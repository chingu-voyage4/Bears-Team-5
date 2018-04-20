import React from 'react';
import PropTypes from 'prop-types';

const HomePage = props => (
  <div>
    <nav>
      <ul>
        {props.categories.map(category => (
          <li key={Math.floor(Math.random() * 9999)}>
            <a href="/">{category}</a>
          </li>
        ))}
      </ul>
    </nav>
    <h2>Featured</h2>
    {props.featuredArticles.length === 0 ? (
      <p>No articles to display</p>
    ) : (
        props.featuredArticles.map(article => (
          <div key={Math.floor(Math.random() * 9999)}>
            <h3>{article.title}</h3>
            <p>{article.subtitle}</p>
            <p>{article.author}</p>
            <img src={article.articleImgURL} alt="article thumbnail" height="300" width="300" />
          </div>
        ))
      )}
    <h2>Latest</h2>
    {props.latestArticles.length === 0 ? (
      <p>No articles to display</p>
    ) : (
        props.latestArticles.map(article => (
          <div key={Math.floor(Math.random() * 9999)}>
            <h3>{article.title}</h3>
            <p>{article.subtitle}</p>
            <p>{article.author}</p>
            <img src={article.articleImgURL} alt="article thumbnail" height="300" width="300" />
          </div>
        ))
      )}
  </div>
);

HomePage.propTypes = {
  latestArticles: PropTypes.array.isRequired,
  featuredArticles: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired
};

HomePage.defaultProps = {
  latestArticles: [],
  featuredArticles: [{
    title: 'I am your father!',
    subtitle: '',
    author: 'Darth Vader',
    articleImgURL: 'http://reggiestake.files.wordpress.com/2012/06/darth-vader-2.jpg'
  }],
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
