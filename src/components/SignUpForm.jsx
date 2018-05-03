import React, { Component } from 'react';
import axios from 'axios';

export default class SignUpForm extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    errors: []
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

  onSubmit = e => {
    e.preventDefault();
    const data = {
      username: this.state.username,
      password: this.state.password,
      confirmpassword: this.state.confirmPassword,
      email: this.state.email
    };
    this.props.onSubmit(data);
  };

  render() {
    return (
      <div>
        <form className="authentication-form" onSubmit={this.onSubmit}>
          <h3 className="authentication-form__title">Sign Up</h3>
          {this.state.errors.map((error, index) => (
            <p key={index}>{error.charAt(0).toUpperCase() + error.slice(1)}</p>
          ))}
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
            <label htmlFor="email">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={this.state.email}
              onChange={this.onEmailChange}
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
          <div className="authentication-form__row">
            <label htmlFor="confirmPassword">
              Confirm Password:
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={this.state.confirmPassword}
              onChange={this.onConfirmPasswordChange}
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
