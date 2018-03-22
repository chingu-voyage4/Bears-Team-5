import React, { Component } from 'react';
import Modal from 'react-modal';
import SignUpForm from './SignUpForm';

class UserAuthentication extends Component {
  state = {
    modalContent: 'Sign Up',
    modalIsOpen: false
  };

  triggerModal = e => {
    const modalContent = e.target.name;
    this.setState(() => ({ modalContent, modalIsOpen: true }));
  };

  closeModal = () => {
    this.setState(() => ({ modalIsOpen: false }));
  };

  render() {
    return (
      <div>
        <button onClick={this.triggerModal} name="Sign Up">
          Sign Up
        </button>
        <button onClick={this.triggerModal} name="Log In">
          Log In
        </button>
        <Modal
          isOpen={this.state.modalIsOpen}
          contentLabel={this.state.modalContent}
          onRequestClose={() => this.setState(() => ({ modalIsOpen: false }))}
        >
          <a onClick={this.closeModal}>&times;</a>
          {this.state.modalContent === 'Sign Up' ? <SignUpForm /> : <p>Log In</p>}
        </Modal>
      </div>
    );
  }
}

export default UserAuthentication;
