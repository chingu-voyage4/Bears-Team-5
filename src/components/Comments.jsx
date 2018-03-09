import React from 'react';
import Comment from './Comment';

const Comments = props => (
  <div>
    {props.comments.map(comment => (
      <Comment userName={comment.userName} commentBody={comment.commentBody} />
    ))}
  </div>
);

export default Comments;
