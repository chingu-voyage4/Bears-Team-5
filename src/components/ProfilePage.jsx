import React, { Component } from 'react';

const ProfilePage = props => (
  <div>
    <h2>{props.username}</h2>
    <p>{props.numFollowing}</p>
    <p>{props.numFollowers}</p>
    <img src={props.userImgURL} height="30px" width="30px" />
  </div>
);

ProfilePage.propTypes = {
  username: PropTypes.string.isRequired,
  numFollowing: PropTypes.number.isRequired,
  numFollowers: PropTypes.number.isRequired,
  userImgURL: PropTypes.string
};

ProfilePage.defaultProps = {
  userImgURL: 'https://i.imgur.com/mECBxga.png'
};

export default ProfilePage;
