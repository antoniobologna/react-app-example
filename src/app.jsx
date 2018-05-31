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
  }

  async componentDidMount() {
    const user = await this.isAuth();
    this.setState({ isAuth: user.authenticated, user: user.data });
  }

  isAuth = () => (
    fetch(constants.api.isAuth, globalParameters())
      .then(response => response.json())
      .then(({ data }) => data)
  )

  PublicRoute = ({ component: PublicComponent, ...rest }) => {
    const { isAuth } = this.state;

    return (
      <Route
        { ...rest }
        render={props => (
          !isAuth ?
            <PublicComponent { ...props } /> :
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
            <PrivateComponent { ...props } user={user} /> :
            <Redirect to={{ pathname: '/login' }} />
        )} />
    );
  }

  render() {
    const { isAuth, user } = this.state;
    const { PrivateRoute, PublicRoute } = this;

    return (
      <Router>
        <main>
          { isAuth ? <Menu /> : null }
          <Switch>
            <PublicRoute path='/' component={ Auth } exact />
            <PublicRoute path='/login' component={ Auth } />
            <PrivateRoute path='/home' component={ Home } user={user}/>
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
