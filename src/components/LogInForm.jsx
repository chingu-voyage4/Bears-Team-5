import React, { Component } from 'react';

export default class LogInForm extends Component {
  state = {
    username: '',
    password: ''
  };

  onUsernameChange = e => {
    const value = e.target.value;
    this.setState(() => ({
      username: value
    }));
  };

  onPasswordChange = e => {
    const value = e.target.value;
    this.setState(() => ({
      password: value
    }));
  };

  onSubmit = e => {
    e.preventDefault();
    const userCredentials = {
      username: this.state.username,
      password: this.state.password
    };
    this.props.onSubmit(userCredentials);
  };

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          {
            this.props.error && 
            <p>{this.props.error.charAt(0).toUpperCase() + this.props.error.slice(1)}</p>
          }
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
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}
