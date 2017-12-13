import React, { Component } from 'react';

class Nav extends Component {
  render() {
    const { user, logout, login } = this.props;
    return (
      <div className="nav">
        <h1>Shopping List</h1>
        {user ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <button onClick={login}>Log In</button>
        )}
      </div>
    );
  }
}
export default Nav;
