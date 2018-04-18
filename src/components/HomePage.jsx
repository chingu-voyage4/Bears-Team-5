import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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
    <h2>Latest</h2>
    {props.latestArticles.length === 0 ? (
      <p>No articles to display</p>
    ) : (
        props.latestArticles.map(article => (
          <div key={Math.floor(Math.random() * 9999)}>
            <h3>{article.title}</h3>
            <img src={article.image} alt="article thumbnail" height="300" width="300" />
          </div>
        ))
      )}
  </div>
);

HomePage.propTypes = {
  latestArticles: PropTypes.array,
  categories: PropTypes.array
};

HomePage.defaultProps = {
  lastestArticles: [],
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

const mapStateToProps = state => ({
  latestArticles: state.articles.feed
});

export default connect(mapStateToProps)(HomePage);
