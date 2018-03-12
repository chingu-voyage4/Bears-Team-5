import React from 'react';
import AuthorDetails from './AuthorDetails';
import Comments from './Comments';

export default class ArticlePage extends React.Component {
  state = {
    article: {
      title: this.props.article.title,
      body: this.props.article.body,
    },
    comments: this.props.comments,
  };

  render() {
    return (
      <div>
        <AuthorDetails
          imgUrl="https://i.imgur.com/hyqmyzn.png"
          authorName="Colonel Cockerel"
          authorDetails="Leader of the Chicken Uprising, sworn enemy of KFC"
        />
        <h2>{this.state.article.title}</h2>
        <p>{this.state.article.body}</p>
        <AuthorDetails
          imgUrl="https://i.imgur.com/hyqmyzn.png"
          authorName="Colonel Cockerel"
          authorDetails="Leader of the Chicken Uprising, sworn enemy of KFC"
        />
        <div>
          <button>Like</button>
        </div>
        <ul>
          <li>
            <a href="#">Suggested Article</a>
          </li>
          <li>
            <a href="#">Suggested Article</a>
          </li>
          <li>
            <a href="#">Suggested Article</a>
          </li>
        </ul>
        <h3>Comments go here</h3>
        <Comments comments={this.state.comments} />
      </div>
    );
  }
}

ArticlePage.defaultProps = {
  article: {
    title: 'Article Title',
    body:
      'Lorem ipsum dolor sit amet consectetur adipiscing elit faucibus sociosqu, nostra habitant at nam integer primis auctor non, feugiat risus sodales odio posuere augue ad aliquet.',
  },
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
