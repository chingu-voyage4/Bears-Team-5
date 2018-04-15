import React from 'react';
import PropTypes from 'prop-types';

const AuthorDetails = props => (
  <div className="details">
    <img src={props.imgUrl} height="50" width="50" alt="user icon" className="details__image" />
    <div>
      <p className="details__text">{props.name}</p>
      <p className="details__text">{props.details === '' ? 'Draft' : props.details}</p>
    </div>
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
