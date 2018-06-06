import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Route, Link, Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { globalParameters } from './utils';
import constants from './constants';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const styles = () => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
});

const MenuLink = ({ content, to }) => (
  <Route path={to}>
    <Link to={to}>{ content }</Link>
  </Route>
);

class Menu extends Component {
  handleLogout = async (event) => {
    event.preventDefault();
    const isLogout = await this.logout();

    if(isLogout) {
      this.setState({ isLogout })
    }
  }

  logout = () => (
    fetch(constants.api.logout, globalParameters('POST'))
      .then(response => {
        if(response.ok) {
          return this.props.logout();
        }

        return false;
      })
  )

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>

            <Typography variant="title" color="inherit" className={classes.flex}>
              React Auth Example
            </Typography>

            <Typography variant="title" color="inherit" className={classes.flex}>
              <MenuLink to="/home" content="Home" />
            </Typography>

            <Button color="inherit" onClick={this.handleLogout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}


Menu.propTypes = {
  classes: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
};

MenuLink.propTypes = {
  content: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};

export default withStyles(styles)(Menu);
