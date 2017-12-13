import React, { Component } from 'react';
import Nav from './Nav';
import './App.css';
import firebase, { auth, provider } from './firebase';

class App extends Component {
  state = {
    currentItem: '',
    username: '',
    items: [],
    user: null,
    recurringItem: false,
  };

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
      }
    });
    const itemsRef = firebase.database().ref('items');
    itemsRef.on('value', snapshot => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({
          id: item,
          title: items[item].title,
          user: items[item].user,
          recurring: items[item].recurring,
        });
      }
      this.setState({
        items: newState,
      });
    });
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleOptionChange = e => {
    if (!this.state.isChecked) {
      this.setState({
        recurringItem: true
      })
    } else {
      this.setState({
        recurringItem: false
      })
    }
  };

  login = () => {
    auth.signInWithPopup(provider).then(result => {
      const user = result.user;
      this.setState({
        user,
      });
    });
  };

  logout = () => {
    auth.signOut().then(() => {
      this.setState({
        user: null,
      });
    });
  };

  removeItem = itemId => {
    const itemRef = firebase.database().ref(`/items/${itemId}`);
    itemRef.remove();
  };

  handleSubmit = e => {
    e.preventDefault();
    //we need to carve out a space in our Firebase database where we'd like to store all of the items. We do this by calling the ref method and passing in the destination we'd like them to be stored (items).
    const itemsRef = firebase.database().ref('items');
    const item = {
      title: this.state.currentItem,
      user: this.state.user.displayName || this.state.user.email,
      recurring: this.state.recurringItem,
    };
    itemsRef.push(item);
    this.setState({
      currentItem: '',
      username: '',
      recurringItem: null,
    });
  };

  render() {
    return (
      <div className="app">
        <Nav logout={this.logout} login={this.login} user={this.state.user} />
        {this.state.user ? (
          <div>
            <div className="container">
              <section className="add-item">
                <form onSubmit={this.handleSubmit}>
                  <input
                    type="text"
                    name="username"
                    placeholder="What's your name?"
                    readOnly
                    value={this.state.user.displayName || this.state.user.email}
                  />
                  <input
                    type="text"
                    name="currentItem"
                    placeholder="What do you want?"
                    onChange={this.handleChange}
                    value={this.state.currentItem}
                  />
                  <label>Is this a recurring item?</label>
                  <input
                    type="checkbox"
                    name="recurring"
                    onChange={this.handleOptionChange}
                    checked={this.state.recurringItem}
                  />
                  <button>Add Item</button>
                </form>
              </section>
            </div>
            <div className="container">
              <section className="display-item">
                <div className="wrapper">
                  <ul>
                    {this.state.items.map(item => {
                      return (
                        <li key={item.id}>
                          <h3>{item.title}{item.recurring ? `Recurring` : null}</h3>
                          <p>
                            Added By: {item.user}
                            {item.user === this.state.user.displayName ||
                            item.user === this.state.user.email ? (
                              <button onClick={() => this.removeItem(item.id)}>
                                Remove Item
                              </button>
                            ) : null}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </section>
            </div>
          </div>
        ) : (
          <div className="wrapper">
            <p>You must be logged in to see</p>
          </div>
        )}
      </div>
    );
  }
}
export default App;
