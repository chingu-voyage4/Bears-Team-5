import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

export default class SignUpPage extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    modalIsOpen: false,
    errors: []
  };

  closeModal = () => {
    this.setState(() => ({ modalIsOpen: false }));
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
    const url = 'http://localhost:4000/api/user';
    axios({
      url,
      method: 'post',
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      },
      modalIsOpen: false
    })
      .then(response => {
        this.setState(() => ({ modalIsOpen: true }));
      })
      .catch(error => {
        const errors = error.response.data.errors.map(error => error.msg);
        this.setState(() => ({ errors }));
      });
  };

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          {this.state.errors.map((error, index) => (
            <p key={index}>{error.charAt(0).toUpperCase() + error.slice(1)}</p>
          ))}
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
          <br />
          <button type="submit">Submit</button>
        </form>
        <Modal
          isOpen={this.state.modalIsOpen}
          contentLabel="Registration successful"
          onRequestClose={() => this.setState(() => ({ modalIsOpen: false }))}
        >
          <a onClick={this.closeModal}>&times;</a>
          <p>You have successfully registered!</p>
        </Modal>
      </div>
    );
  }
}
