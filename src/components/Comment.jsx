import React from 'react';
import PropTypes from 'prop-types';

const Comment = props => (
  <div className="comment">
    <div>
      <img src="https://i.imgur.com/mECBxga.png" alt="User logo goes here" />
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
