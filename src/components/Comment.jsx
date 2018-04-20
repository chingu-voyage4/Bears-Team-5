import React from 'react';
import PropTypes from 'prop-types';
import AuthorDetails from "../components/AuthorDetails";

const Comment = props => (
  <div className="comment">
    <AuthorDetails name={props.userName} />
    <p>{props.commentBody}</p>
  </div>
);

Comment.propTypes = {
  userName: PropTypes.string.isRequired,
  commentBody: PropTypes.string.isRequired,
};

export default Comment;
