import React from 'react';
import { connect } from 'react-redux';
import parser from 'html-react-parser';
import marked from 'marked';
import AuthorDetails from './AuthorDetails';
import Comments from './Comments';

const ArticlePage = props => (
  <div className="article container">
    <AuthorDetails
      imgUrl="https://i.imgur.com/hyqmyzn.png"
      name="Colonel Cockerel"
      details="Leader of the Chicken Uprising, sworn enemy of KFC"
    />
    <h2 className="article__title">{props.article.title}</h2>
    {
      parser(marked(props.article.body))
    }
    <AuthorDetails
      imgUrl="https://i.imgur.com/hyqmyzn.png"
      name="Colonel Cockerel"
      details="Leader of the Chicken Uprising, sworn enemy of KFC"
    />
    <div>
      <button className="article__like">Like</button>
    </div>
    <h3>Suggested Articles</h3>
    <ul className="article__suggestions">
      <li>
        <a href="#">
          <img src="https://i.imgur.com/FMA5Y3v.jpg" />
          <div>
            <h3>Suggested Article</h3>
            <AuthorDetails name="Name Goes Here" />
          </div>
        </a>
      </li>
      <li>
        <a href="#">
          <img src="https://i.imgur.com/FMA5Y3v.jpg" />
          <div>
            <h3>Suggested Article</h3>
            <AuthorDetails name="Name Goes Here" />
          </div>
        </a>
      </li><li>
        <a href="#">
          <img src="https://i.imgur.com/FMA5Y3v.jpg" />
          <div>
            <h3>Suggested Article</h3>
            <AuthorDetails name="Name Goes Here" />
          </div>
        </a>
           </li>
    </ul>
    <h3>Comments</h3>
    <Comments comments={props.comments} />
  </div>
);

ArticlePage.defaultProps = {
  comments: [
    {
      userName: 'Jethro',
      commentBody: 'This is my comment',
    },
    {
      userName: 'Lisa',
      commentBody: 'React is amazing',
    },
  ],
};

const mapStateToProps = (state, props) => ({
  article: state.articles.feed.find(article => article.slug === props.match.params.slug),
});

export default connect(mapStateToProps)(ArticlePage);
