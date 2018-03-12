import React from 'react';
import PropTypes from 'prop-types';

const Comment = props => (
  <div>
    <img src="" alt="User logo goes here" />
    <p>{props.userName}</p>
    <p>{props.commentBody}</p>
    <button>Like</button>
    <button>Bookmark</button>
  </div>
);

Comment.propTypes = {
  userName: PropTypes.string.isRequired,
  commentBody: PropTypes.string.isRequired,
};

export default Comment;
