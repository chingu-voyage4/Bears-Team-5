import React from "react";

const AuthorDetails = props => (
  <div>
    <img src={props.imgUrl} height="50" width="50" />
    <p>{props.authorName}</p>
    <p>{props.authorDetails}</p>
    <p>
      {props.date} . {props.readingTime}
    </p>
  </div>
);

export default AuthorDetails;
