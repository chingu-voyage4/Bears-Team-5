import React, { Component } from 'react';

export default class SignUpPage extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  onUsernameChange = e => {
    const value = e.target.value;
    this.setState(() => ({
      username: value
    }));
  };

  onEmailChange = e => {
    const value = e.target.value;
    this.setState(() => ({
      email: value
    }));
  };

  onPasswordChange = e => {
    const value = e.target.value;
    this.setState(() => ({
      password: value
    }));
  };

  onConfirmPasswordChange = e => {
    const value = e.target.value;
    this.setState(() => ({
      confirmPassword: value
    }));
  };

  render() {
    return (
      <div>
        <form>
          <label htmlFor="username">
            Username:
            <input
              type="text"
              name="username"
              value={this.state.username}
              onChange={this.onUsernameChange}
            />
          </label>
          <br />
          <label htmlFor="email">
            Email:
            <input
              type="email"
              name="email"
              value={this.state.email}
              onChange={this.onEmailChange}
            />
          </label>
          <br />
          <label htmlFor="password">
            Password:
            <input
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.onPasswordChange}
            />
          </label>
          <br />
          <label htmlFor="confirmPassword">
            Confirm Password:
            <input
              type="password"
              name="confirmPassword"
              value={this.state.confirmPassword}
              onChange={this.onConfirmPasswordChange}
            />
          </label>
        </form>
      </div>
    );
  }
}
