/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

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
});

class Auth extends Component {
  state = {
    username: '',
  }

  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    });
  }

  render() {
    const { classes } = this.props;
    const { username } = this.state;

    return (
      <div className={classes.root}>
        <Grid container spacing={24} justify="center">
          <Grid item xs={4} sm={4}>
            <Paper className={classes.paper}>
              <form className={classes.authForm} noValidate autoComplete="off">
                <TextField
                  id="username"
                  label="Username"
                  className={classes.textField}
                  value={username}
                  onChange={this.handleChange}
                  margin="normal"
                />
                <TextField
                  id="password"
                  label="Password"
                  className={classes.textField}
                  type="password"
                  autoComplete="current-password"
                  margin="normal"
                />
                <Button type="submit" variant="raised" color="primary" className={classes.button}>
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
};

export default withStyles(styles)(Auth);
