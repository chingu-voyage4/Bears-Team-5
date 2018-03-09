import React from 'react';

const Comment = props => (
  <div>
    <img src="" alt="User logo goes here" />
    <p>{props.username}</p>
    <p>{props.commentBody}</p>
    <button>Like</button>
    <button>Bookmark</button>
  </div>
);

export default Comment;
