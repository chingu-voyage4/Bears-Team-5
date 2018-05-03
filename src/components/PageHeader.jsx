import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { setMessage } from '../actions/messages';
import SignUpForm from './SignUpForm';
import LogInForm from './LogInForm';
import { startLogIn, startSignUp } from '../actions/auth';


class PageHeader extends Component {
  state = {
    token: localStorage.getItem('token') || '',
    username: localStorage.getItem('username') || '',
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

  onLogIn = userCredentials => {
    this.props.startLogIn(userCredentials)
      .then(() => {
        this.setState(() => ({
          token: localStorage.getItem('token'),
          username: localStorage.getItem('username')
        }))
        this.closeModal();
      });
  };

  onSignUp = userCredentials => {
    this.props.startSignUp(userCredentials)
      .then(() => {
        this.closeModal();
      });
  };

  render() {
    return (
      <div className="header">
        {/* {this.props.message && <p className="header__message">{this.props.message}</p>} */}
        <Link to="/">
          <h3 className="header__title">Medium Clone</h3>
        </Link>
        {this.state.token === '' ? (
          <div className="authentication">
            <button onClick={this.triggerModal} name="Sign Up" className="button">
              Sign Up
            </button>
            <button onClick={this.triggerModal} name="Log In" className="button">
              Log In
            </button>
            <Modal
              isOpen={this.state.modalIsOpen}
              contentLabel={this.state.modalContent}
              onRequestClose={() => this.setState(() => ({ modalIsOpen: false }))}
              className="modal"
            >
              <a onClick={this.closeModal} className="modal__close">&times;</a>
              {this.state.modalContent === 'Sign Up' ? (
                <SignUpForm onSubmit={this.onSignUp} errors={this.props.signUpErrors} />
              ) : (
                  <LogInForm onSubmit={this.onLogIn} error={this.props.loginError} />
                )}
            </Modal>
          </div>
        ) : (
            <div>
              <Link to={`/profile/${this.state.username}`} >
                <span className="header__profile-link">Welcome, {this.state.username}!</span>
              </Link>
              <a onClick={this.onClick} >Log Out</a>
            </div>
          )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  message: state.messages.message,
  loginError: state.errors.loginError,
  signUpErrors: state.errors.signUpErrors
});

const mapDispatchToProps = dispatch => ({
  setMessage: (message) => dispatch(setMessage(message)),
  startLogIn: userCredentials => dispatch(startLogIn(userCredentials)),
  startSignUp: userCredentials => dispatch(startSignUp(userCredentials)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PageHeader);
