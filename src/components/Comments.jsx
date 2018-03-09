import React from 'react';
import PropTypes from 'prop-types';
import Comment from './Comment';

const Comments = props => (
  <div>
    {props.comments.map(comment => (
      <Comment userName={comment.userName} commentBody={comment.commentBody} />
    ))}
  </div>
);

Comments.propTypes = {
  comments: PropTypes.array.isRequired,
};

export default Comments;
