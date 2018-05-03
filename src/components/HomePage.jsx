import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { setCategory, startSetArticles } from '../actions/articles';

class HomePage extends Component {
  state = {
    currentCategory: this.props.articles.all
  }

  onClick = e => {
    const category = e.target.innerHTML;
    if (category === 'home') {
      this.setState(() => ({
        currentCategory: this.props.articles.all
      }))
    } else {
      this.setState(() => ({
        currentCategory: this.props.articles[category]
      }))
    }
  }

  render() {
    return (
      <div className="home">
        <nav>
          <ul className="home__nav">
            {this.props.categories.map(category => (
              <li key={Math.floor(Math.random() * 9999)} className="home__nav-link">
                <a href="#" onClick={this.onClick} >{category}</a>
              </li>
            ))}
          </ul>
        </nav>
        <h2 className="home__title">Latest</h2>
        <div className="article-list">
          {this.state.currentCategory.length === 0 ? (
            <p>No articles to display</p>
          ) : (
              this.state.currentCategory.map(article => (
                <div key={Math.floor(Math.random() * 9999)} className="article-list__article">
                  <Link to={`/articles/view/${article.slug}`}>
                    <h3 className="article-list__article-title">{article.title}</h3>
                    <img src={article.image} alt="article thumbnail" className="article-list__article-image" />
                  </Link>
                </div>
              ))
            )}
        </div>
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
  articles: state.articles.feed,
});

export default connect(mapStateToProps)(HomePage);
