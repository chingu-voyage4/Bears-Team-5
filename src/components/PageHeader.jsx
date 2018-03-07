import React from 'react';

const PageHeader = () => (
  <div>
    <img
      src="https://i.imgur.com/j7ArnQ5.png"
      alt="logo goes here"
      style={{ height: '50px', width: '50px', float: 'left' }}
    />
    <div style={{ float: 'right' }}>
      <button>Sign in</button>
      <button>Create account</button>
    </div>
  </div>
);

export default PageHeader;
