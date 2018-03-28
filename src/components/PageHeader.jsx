import React from 'react';
import UserAuthentication from './UserAuthentication';

const token = localStorage.getItem('token') || '';
console.log(token);

const PageHeader = () => (
  <div>
    <img
      src="https://i.imgur.com/j7ArnQ5.png"
      alt="logo goes here"
      style={{ height: '50px', width: '50px', float: 'left' }}
    />
    {token === '' ? <UserAuthentication /> : 'Link to profile goes here'}
  </div>
);

export default PageHeader;
