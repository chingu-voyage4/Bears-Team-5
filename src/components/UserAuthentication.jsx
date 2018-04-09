import React, { Component } from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import SignUpForm from './SignUpForm';
import LogInForm from './LogInForm';
import { startLogIn } from '../actions/auth';

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

  onSubmit = userCredentials => {
    this.props.startLogIn(userCredentials);
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
          {this.state.modalContent === 'Sign Up' ? (
            <SignUpForm />
          ) : (
            <LogInForm onSubmit={this.onSubmit} errors={this.props.errors} />
          )}
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  errors: state.errors
});

const mapDispatchToProps = dispatch => ({
  startLogIn: userCredentials => dispatch(startLogIn(userCredentials))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserAuthentication);
