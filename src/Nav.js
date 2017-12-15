import React, { Component } from 'react';

class Nav extends Component {
  render() {
    const { user, logout, login } = this.props;
    return (
      <div className="nav">
        <h1>Shopping List</h1>
        {user ? (
          <div className="flex-row">
            <span>{user.displayName}</span>
            <div className="profile-image" style={{backgroundImage: `url('${user.photoURL}')`}} />
            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          <button onClick={login}>Log In</button>
        )}
      </div>
    );
  }
}
export default Nav;
