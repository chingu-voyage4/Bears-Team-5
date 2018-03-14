import React from 'react';
import ReactDOM from 'react-dom';
import ProfilePage from './components/ProfilePage';

const articles = [
  {
    title: 'Do or Do Not, There Is No Try',
    author: 'Yoda'
  },
  {
    title: 'I Am Your Father!',
    author: 'Darth Vader'
  },
  {
    title: 'May the 4th Be With You',
    author: 'George Lucas'
  }
];

ReactDOM.render(
  <ProfilePage
    numFollowers={11}
    numFollowing={1}
    username="Jethro William Fredericks"
    likedArticles={articles}
  />,
  document.getElementById('app')
);
