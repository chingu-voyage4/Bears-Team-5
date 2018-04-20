import React, { Component } from 'react';
import { Link } from 'react-router-dom';
        
import UserAuthentication from './UserAuthentication';

const token = localStorage.getItem('token') || '';
console.log(token);

class PageHeader extends Component {
  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }

  render() {
    return (
      <div className="header">
        <h3 className="header__title">Medium Clone</h3>
        {token === '' ? (
          <UserAuthentication />
        ) : (
          <Link to={`/profile/${username}`} >
              Welcome, {username}!
              <button onClick={this.logOut} >Log Out</button>
            </Link>
          )}
      </div>
    );
  }
}

export default PageHeader;
