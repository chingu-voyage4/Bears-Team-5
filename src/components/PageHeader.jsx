import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setMessage } from '../actions/messages';
import UserAuthentication from './UserAuthentication';

class PageHeader extends Component {
  state = {
    token: localStorage.getItem('token') || '',
    username: localStorage.getItem('username')
  }

  onClick = (e) => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.props.setMessage("Logged out successfully");
    this.props.history.push("/");
  }

  render() {
    return (
      <div className="header">
        {this.props.message && <p>{this.props.message}</p>}
        <Link to="/">
          <h3 className="header__title">Medium Clone</h3>
        </Link>
        {this.state.token === '' ? (
          <UserAuthentication  />
        ) : (
            <Link to={`/profile/${this.state.username}`} >
              Welcome, {this.state.username}!
              <br />
              <button onClick={this.onClick}>Log Out</button>
            </Link>
          )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  message: state.messages.message
});

const mapDispatchToProps = dispatch => ({
  setMessage: (message) => dispatch(setMessage(message))
});

export default connect(mapStateToProps, mapDispatchToProps)(PageHeader);
