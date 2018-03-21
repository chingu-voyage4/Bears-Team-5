import React, { Component } from 'react';
import Modal from 'react-modal';
import SignUpForm from './SignUpForm';

class UserAuthentication extends Component {
  state = {
    modalContent: 'signUp',
    modalIsOpen: false
  };

  triggerModal = e => {
    const modalContent = e.target.name;
    this.setState(() => ({ modalContent }));
  };

  render() {
    return (
      <div>
        <button onClick={this.triggerModal} name="signUp">
          Sign Up
        </button>
        <button onClick={this.triggerModal} name="logIn">
          Log In
        </button>
      </div>
    );
  }
}

export default UserAuthentication;
