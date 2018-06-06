/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import 'babel-polyfill';
import {
  Route,
  BrowserRouter as Router,
  Redirect,
  Switch,
} from 'react-router-dom';
import { globalParameters } from './utils';

import Menu from './menu';
import Auth from './auth';
import Home from './home';
import constants from './constants';

const styles = () => ({
  root: {
    flexGrow: 1,
  },
});

class App extends Component {
  state = {
    isAuth: false,
    user: null,
  }

  async componentDidMount() {
    const isAuth = await this.isAuth();
    let user = {};

    if (isAuth) {
      user = await this.fetchUser();
    }

    this.setState({ isAuth, user });
  }

  isAuth = () => (
    fetch(constants.api.isAuth, globalParameters())
      .then(response => response.json())
      .then(({ data }) => data)
  )

  authenticate = async (isAuth = true) => {
    let user = null;

    if(isAuth) {
      user = await this.fetchUser();
    }

    this.setState({ isAuth, user })
  }

  fetchUser = () => (
    fetch(constants.api.user, globalParameters())
      .then(response => response.json())
      .then(({ data }) => data)
  )

  PublicRoute = ({ component: PublicComponent, authenticate, ...rest }) => {
    const { isAuth } = this.state;

    return (
      <Route
        { ...rest }
        render={props => (
          !isAuth ?
            <PublicComponent { ...props } authenticate={ authenticate } /> :
            <Redirect to={{ pathname: '/home' }} />
        )} />
    );
  }

  PrivateRoute = ({ component: PrivateComponent, path, user, ...rest }) => {
    const { isAuth } = this.state;

    return (
      <Route
        path={ path }
        { ...rest }
        render={props => (
          isAuth ?
            <PrivateComponent { ...props } user={ user } /> :
            <Redirect to={{ pathname: '/login' }} />
        )} />
    );
  }

  render() {
    const { isAuth, user } = this.state;
    const { PrivateRoute, PublicRoute, authenticate } = this;

    return (
      <Router>
        <main>
          { isAuth ? <Menu logout={ () => authenticate(false) } /> : null }
          <Switch>
            <PublicRoute path='/' component={ Auth } exact authenticate={ authenticate } />
            <PublicRoute path='/login' component={ Auth } authenticate={ authenticate } />
            <PrivateRoute path='/home' component={ Home } user={ user }/>
            <Route render={ () => <h3>No Match</h3> } />
          </Switch>
        </main>
      </Router>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
