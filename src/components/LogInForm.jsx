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
        <form className="authentication-form" onSubmit={this.onSubmit}>
          <h3 className="authentication-form__title">Log In</h3>
          {
            this.props.error &&
            <p>{this.props.error.charAt(0).toUpperCase() + this.props.error.slice(1)}</p>
          }
          <div className="authentication-form__row">
            <label htmlFor="username">
              Username:
          </label>
            <input
              type="text"
              name="username"
              value={this.state.username}
              onChange={this.onUsernameChange}
            />
          </div>
          <div className="authentication-form__row">
            <label htmlFor="password">
              Password:
          </label>
            <input
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.onPasswordChange}
            />
          </div>
          <div className="authentication-form__button">
            <button type="submit" className=" button">Submit</button>
          </div>
        </form>
      </div>
    );
  }
}
