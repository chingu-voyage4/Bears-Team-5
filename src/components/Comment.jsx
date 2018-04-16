import React from 'react';
import PropTypes from 'prop-types';

const Comment = props => (
  <div>
    <div>
      <img src="" alt="User logo goes here" />
      <p>{props.userName}</p>
    </div>
    <p>{props.commentBody}</p>
  </div>
);

Comment.propTypes = {
  userName: PropTypes.string.isRequired,
  commentBody: PropTypes.string.isRequired,
};

export default Comment;
