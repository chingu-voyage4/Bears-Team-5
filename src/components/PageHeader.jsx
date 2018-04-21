import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import UserAuthentication from './UserAuthentication';

const token = localStorage.getItem('token') || '';
const username = localStorage.getItem('username');

const PageHeader = props => (
  <div className="header">
    {props.message && <p>{props.messge}</p>}
    <Link to="/">
      <h3 className="header__title">Medium Clone</h3>
    </Link>
    {token === '' ? (
      <UserAuthentication />
    ) : (
      <Link to={`/profile/${username}`} >
          Welcome, {username}!
        </Link>
      )}
  </div>
);

const mapStateToProps = state => ({
  message: state.messages.message
});

export default connect(mapStateToProps)(PageHeader);
