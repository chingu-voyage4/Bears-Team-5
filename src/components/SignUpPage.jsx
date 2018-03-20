import React, { Component } from 'react';

export default class SignUpPage extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  render() {
    return (
      <div>
        <form contentType="application/json">
          <label htmlFor="username">
            Username:
            <input type="text" name="username" />
          </label>
          <br />
          <label htmlFor="email">
            Email:
            <input type="email" name="email" />
          </label>
          <br />
          <label htmlFor="password">
            Password:
            <input type="password" name="password" />
          </label>
          <br />
          <label htmlFor="confirmPassword">
            Confirm Password:
            <input type="password" name="confirmPassword" />
          </label>
        </form>
      </div>
    );
  }
}
