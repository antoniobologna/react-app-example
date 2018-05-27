import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Route, Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { globalParameters } from './utils';
import constants from './constants';

const styles = () => ({
  root: {
    flexGrow: 1,
  },
});

const logout = () => (
  fetch(constants.api.logout, globalParameters())
    .then(response => response.json())
    .then(({ data }) => (data))
    .catch((error) => {
      console.error(error);
    })
);

const MenuLink = ({ content, to }) => (
  <Route path={to}>
    <li>
      <Link to={to}>{ content }</Link>
    </li>
  </Route>
);

class Menu extends Component {
  handleLogout = (event) => {
    event.preventDefault();
    logout();
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={24} justify="center">
          <Grid item xs={12} sm={12}>
            <ul>
              <MenuLink to="/home" content="Home" />
              <li><a href="#" onClick={this.handleLogout}>Logout</a></li>
            </ul>
          </Grid>
        </Grid>
      </div>
    );
  }
}


Menu.propTypes = {
  classes: PropTypes.object.isRequired,
};

MenuLink.propTypes = {
  content: PropTypes.object.isRequired,
  to: PropTypes.string.isRequired,
};

export default withStyles(styles)(Menu);
