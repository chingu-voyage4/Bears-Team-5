import React from 'react';
import ReactDOM from 'react-dom';
import ProfilePage from './components/ProfilePage';

const likedArticles = [
  {
    author: {
      username: 'Yoda',
      details: 'Awesome, I am'
    },
    title: 'Do or do not, there is not try'
  },
  {
    author: {
      username: 'Darth Vader',
      details: 'You have failed me yet again'
    },
    title: 'I am your father!'
  }
];

ReactDOM.render(
  <ProfilePage username="Jethro" numFollowers={0} numFollowing={0} likedArticles={likedArticles} />,
  document.getElementById('app')
);
