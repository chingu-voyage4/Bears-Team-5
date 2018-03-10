import React from 'react';
import PropTypes from 'prop-types';

const AuthorDetails = props => (
  <div>
    <img src={props.imgUrl} height="50" width="50" alt="user icon" />
    <p>{props.authorName}</p>
    <p>{props.authorDetails ? 'Draft' : props.authorDetails}</p>
  </div>
);

AuthorDetails.propTypes = {
  imgUrl: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  authorDetails: PropTypes.string,
};

AuthorDetails.defaultProps = {
  authorDetails: '',
};

export default AuthorDetails;
