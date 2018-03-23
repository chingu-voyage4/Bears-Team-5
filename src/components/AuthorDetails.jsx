import React from 'react';
import PropTypes from 'prop-types';

const AuthorDetails = props => (
  <div>
    <img src={props.imgUrl} height="50" width="50" alt="user icon" />
    <p>{props.name}</p>
    <p>{props.details === '' ? 'Draft' : props.details}</p>
  </div>
);

AuthorDetails.propTypes = {
  name: PropTypes.string.isRequired,
  imgUrl: PropTypes.string,
  details: PropTypes.string
};

AuthorDetails.defaultProps = {
  details: '',
  imgUrl: 'https://i.imgur.com/mECBxga.png'
};

export default AuthorDetails;
