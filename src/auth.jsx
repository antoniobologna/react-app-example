/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import constants from './constants';
import { globalParameters } from './utils';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  authForm: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.primary,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  button: {
    margin: theme.spacing.unit,
  },
  error: {
    color: theme.palette.text.red,
  },
});

class Auth extends Component {
  state = {
    username: '',
    password: '',
    error: false,
  }

  handleChange = (event) => {
    const { id, value } = event.currentTarget;

    this.setState({
      [id]: value,
    });
  }

  login = () => {
    const { username, password } = this.state;
    const { authenticate } = this.props;

    return fetch(constants.api.login, globalParameters('POST', { email: username, password }))
      .then(response => {
        if (!response.ok) {
          return this.setState({ error: true });
        }

        return authenticate();
      })
      .catch(err => this.setState({ error: true }));
  }

  render() {
    const { classes } = this.props;
    const { error } = this.state;

    return (
      <div className={classes.root}>
        <Grid container spacing={24} justify="center">
          <Grid item xs={4} sm={4}>
            <Paper className={classes.paper}>
              { error ?
                (<div className={classes.error}>
                  Incorrect credentials. Please try again.
                </div>) : null
              }
              <h1>Todo Login</h1>
              <form className={classes.authForm} noValidate autoComplete="off">
                <TextField
                  id="username"
                  label="Username"
                  className={classes.textField}
                  onChange={this.handleChange}
                  margin="normal"
                />
                <TextField
                  id="password"
                  label="Password"
                  className={classes.textField}
                  onChange={this.handleChange}
                  type="password"
                  margin="normal"
                />
                <Button onClick={this.login} type="button" variant="raised" color="primary" className={classes.button}>
                  Login
                </Button>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Auth.propTypes = {
  classes: PropTypes.object.isRequired,
  authenticate: PropTypes.func.isRequired,
};

export default withStyles(styles)(Auth);
