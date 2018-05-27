/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Auth from './auth';

const styles = () => ({
  root: {
    flexGrow: 1,
  },
});

class App extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={ classes.root }>
        <Auth />
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
