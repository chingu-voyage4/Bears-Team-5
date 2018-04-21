import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { setMessage } from '../actions/messages';
import SignUpForm from './SignUpForm';
import LogInForm from './LogInForm';
import { startLogIn } from '../actions/auth';


class PageHeader extends Component {
  state = {
    token: '',
    username: '',
    modalContent: 'Sign Up',
    modalIsOpen: false
  };

  onClick = (e) => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.setState(() => ({
      token: '',
      username: ''
    }))
    this.props.setMessage("Logged out successfully");
  }

  triggerModal = e => {
    const modalContent = e.target.name;
    this.setState(() => ({ modalContent, modalIsOpen: true }));
  };

  closeModal = () => {
    this.setState(() => ({ modalIsOpen: false }));
  };

  onSubmit = userCredentials => {
    this.props.startLogIn(userCredentials)
      .then(() => {
        this.setState(() => ({
          token: localStorage.getItem('token'),
          username: localStorage.getItem('username')
        }))
        this.closeModal();
      });
  };

  render() {
    return (
      <div className="header">
        {this.props.message && <p>{this.props.message}</p>}
        <Link to="/">
          <h3 className="header__title">Medium Clone</h3>
        </Link>
        {this.state.token === '' ? (
          <div className="authentication">
            <button onClick={this.triggerModal} name="Sign Up" className="authentication__button">
              Sign Up
            </button>
            <button onClick={this.triggerModal} name="Log In" className="authentication__button">
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
                  <LogInForm onSubmit={this.onSubmit} error={this.props.error} />
                )}
            </Modal>
          </div>
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
  message: state.messages.message,
  error: state.errors.loginError
});

const mapDispatchToProps = dispatch => ({
  setMessage: (message) => dispatch(setMessage(message)),
  startLogIn: userCredentials => dispatch(startLogIn(userCredentials))
});

export default connect(mapStateToProps, mapDispatchToProps)(PageHeader);
