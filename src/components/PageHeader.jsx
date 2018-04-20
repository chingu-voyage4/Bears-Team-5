import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import UserAuthentication from './UserAuthentication';

const token = localStorage.getItem('token') || '';
const username = localStorage.getItem('username');

class PageHeader extends Component {
  render() {
    return (
      <div className="header">
        <h3 className="header__title">Medium Clone</h3>
        {token === '' ? (
          <UserAuthentication />
        ) : (
          <Link to={`/profile/${username}`} >
              Welcome, {username}!
              <button>Log Out</button>
            </Link>
          )}
      </div>
    );
  }
}

export default PageHeader;
