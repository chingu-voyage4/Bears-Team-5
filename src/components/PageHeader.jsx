import React from 'react';
import UserAuthentication from './UserAuthentication';

const token = localStorage.getItem('token') || '';

const PageHeader = () => (
  <div className="header">
    <h3 className="header__title">Medium Clone</h3>
    {token === '' ? <UserAuthentication /> : 'Link to profile goes here'}
  </div>
);

export default PageHeader;
