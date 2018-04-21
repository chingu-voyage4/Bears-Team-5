import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { setCategory, startSetArticles } from '../actions/articles';

class HomePage extends Component {
  onClick = e => {
    const category = e.target.innerHTML;
    if (category === 'home') {
      this.props.setArticles();
    } else {
      this.props.setArticles(category);
    }
  }

  render() {
    return (
      <div>
        <nav>
          <ul>
            {this.props.categories.map(category => (
              <li key={Math.floor(Math.random() * 9999)}>
                <a href="#" onClick={this.onClick} >{category}</a>
              </li>
            ))}
          </ul>
        </nav>
        <h2>Latest</h2>
        {this.props.latestArticles.length === 0 ? (
          <p>No articles to display</p>
        ) : (
            this.props.latestArticles.map(article => (
              <div key={Math.floor(Math.random() * 9999)}>
                <Link to={`/articles/view/${article.slug}`}>
                  <h3>{article.title}</h3>
                  <img src={article.image} alt="article thumbnail" height="300" width="300" />
                </Link>
              </div>
            ))
          )}
      </div>
    );
  }
}

HomePage.propTypes = {
  latestArticles: PropTypes.array,
  categories: PropTypes.array
};

HomePage.defaultProps = {
  lastestArticles: [],
  categories: [
    'home',
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
  latestArticles: state.articles.feed,
});

const mapDispatchToProps = dispatch => ({
  setCategory: category => dispatch(setCategory(category)),
  setArticles: (category) => dispatch(startSetArticles(category))
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
